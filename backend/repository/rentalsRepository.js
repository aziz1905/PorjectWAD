import db from '../db/db.js';
import { eq, sql, and, desc, count, sum, gte } from 'drizzle-orm';
import { rentalsTable } from '../db/schema/rentalsSchema.js';
import { productsTable } from '../db/schema/productsSchema.js'; 
import { rentalsDetailTable } from '../db/schema/RentalsDetailSchema.js';
import { productsSizesTable } from '../db/schema/productsSizeSchema.js';
import { paymentsTable } from '../db/schema/paymentSchema.js';

// MEMBUAT PESANAN
export const createRentalTransaction = async (userId, rentalData, detailData) => {
    try {
        return await db.transaction(async (tx) => {
            
            // INSERT ke rentalsTable
            const newRental = await tx
                .insert(rentalsTable)
                .values({ ...rentalData, userId })
                .returning({ id: rentalsTable.id }); // newRental adalah Array

            if (newRental.length === 0) { // Cek panjang Array
                throw new Error('Gagal membuat rental.');
            }
            
            // PERBAIKAN KRITIS: Ambil objek pertama [0] dari array
            const rentalId = newRental[0].id; 

            // INSERT ke paymentsTable (rentalId sekarang sudah benar)
            const newPayment = await tx
                .insert(paymentsTable)
                .values({
                rentalId: rentalId,
        // PERBAIKAN KRITIS DI SINI: Gunakan 'amount' sebagai kunci
                amount: rentalData.totalPayment, // <-- Gunakan properti 'amount' yang sesuai dengan skema
                paymentMethod: rentalData.paymentMethod,
                })
                .returning();

            // 3. Persiapan dan INSERT ke rentalsDetailTable
            const detailInserts = detailData.map(item => ({
                ...item,
                rentalId: rentalId,
            }));

            await tx
                .insert(rentalsDetailTable)
                .values(detailInserts);

            // Kurangi stok produk di productsSizesTable (logic stok tetap)

            const stockUpdatePromises = detailData.map(item => {

                // Melakukan UPDATE
                return tx.update(productsSizesTable)
                    .set({
                        
                        stock: sql`${productsSizesTable.stock} - ${item.unit}` // sql untuk operasi aritmatika yang aman
                    })
                    .where(
                        sql`
                            ${productsSizesTable.productId} = ${item.productId} AND 
                            ${productsSizesTable.sizeName} = ${item.sizeName} AND 
                            ${productsSizesTable.stock} >= ${item.unit}
                            `
                    );
            });

            // memastikan bahwa semua perubahan stok dibatalkan jika salah satu pengurangan stok gagal
            await Promise.all(stockUpdatePromises); 


            return { rental: newRental, payment: newPayment };
        });
    } catch (error) {
        console.error("Error createRentalTransaction:", error);
        throw new Error('Gagal menyelesaikan transaksi rental ');
    }
};



// MENGAMBIL DETAIL PESANAN 
export const getRentalDetailsById = async (rentalId) => {
    const id = parseInt(rentalId);
    if (isNaN(id)) {
        throw new Error("ID Rental tidak valid."); 
    }
    
    try {
        const results = await db
            .select()
            .from(rentalsTable)
            .leftJoin(rentalsDetailTable, eq(rentalsTable.id, rentalsDetailTable.rentalId))
            .leftJoin(productsTable, eq(rentalsDetailTable.productId, productsTable.id))
            .innerJoin(paymentsTable, eq(rentalsTable.id, paymentsTable.rentalId))
            .where(eq(rentalsTable.id, id));

        // Jika tidak ada hasil
        if (results.length === 0) return null;

        // Logika pengelompokan (grouping)
        // Ambil elemen pertama dari array results
        const firstRow = results[0];
        
        // Ambil data dari objek bersarang yang 
        const rental = firstRow.rentals;
        const paymentInfo = firstRow.payments;
        
        // Remap data details/items
        const details = results.map(row => ({
            ...row.rentalDetails, 
            productName: row.products.name,
        }));
        
        return {
            id: rental.id,
            userId: rental.userId,
            totalPayment: rental.totalPayment,
            shippingAddress: rental.shippingAddress,
            orderStatus: rental.orderStatus,      
            returnStatus: rental.returnStatus,    
            payment: paymentInfo,
            items: details,
        };

    } catch (error) {
        console.error("Error Detail Transaksi:", error.message || error.detail); 
        
        // Cek jika error terkait NOT NULL atau FOREIGN KEY
        if (error.code === '23502' || error.code === '23503') { 
            throw new Error(`Kesalahan Data: Periksa ID produk/ukuran atau field yang wajib diisi.`);
        }
    }
};


export const findAllRentals = async () => {
    try {
        const results = await db
            .select({
                rental: rentalsTable,
                detail: rentalsDetailTable,
                product: productsTable,
                payment: paymentsTable,
                user: { email: usersTable.email } // Ambil email user
            })
            .from(rentalsTable)
            .leftJoin(rentalsDetailTable, eq(rentalsTable.id, rentalsDetailTable.rentalId))
            .leftJoin(productsTable, eq(rentalsDetailTable.productId, productsTable.id))
            .innerJoin(paymentsTable, eq(rentalsTable.id, paymentsTable.rentalId))
            .innerJoin(usersTable, eq(rentalsTable.userId, usersTable.id)) // Join ke user
            .orderBy(desc(rentalsTable.orderDate)); 

        if (results.length === 0) return [];

        // Kelompokkan hasil (sama seperti findRentalsByUserId)
        const groupedRentals = results.reduce((acc, row) => {
            const rentalId = row.rental.id;
            if (!acc[rentalId]) {
                acc[rentalId] = {
                    ...row.rental,
                    userEmail: row.user.email, // Tambahkan email
                    paymentStatus: row.payment.payStatus,
                    items: [] 
                };
            }
            
            if (row.product && row.detail) {
                acc[rentalId].items.push({
                    ...row.detail,
                    productName: row.product.name,
                    productImageUrl: row.product.imageUrl
                });
            }
            return acc;
        }, {});

        return Object.values(groupedRentals);

    } catch (error) {
        console.error("Error findAllRentals (Admin):", error);
        throw new Error('Gagal mengambil semua data rental dari database.');
    }
};

// GET /rentals/summary (Admin)
export const getAdminRentalSummary = async () => {
    try {
        // Dapatkan tanggal awal bulan ini
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Query untuk summary
        const summaryResult = await db
            .select({
                monthlyIncome: sum(rentalsTable.totalPayment),
                monthlyRenters: count(rentalsTable.userId), // Ini akan menghitung total row, bukan user unik
                monthlyItemsRented: sum(rentalsTable.totalProduct)
            })
            .from(rentalsTable)
            .where(
                // Filter hanya untuk rental bulan ini dan yang statusnya tidak 'Dibatalkan'
                and(
                    gte(rentalsTable.orderDate, firstDayOfMonth),
                    sql`${rentalsTable.orderStatus} != 'Dibatalkan'`
                )
            );
        
        // Drizzle mengembalikan array, ambil [0]
        const summary = summaryResult[0];

        return {
            monthlyIncome: parseFloat(summary.monthlyIncome) || 0,
            monthlyRenters: parseInt(summary.monthlyRenters) || 0,
            monthlyItemsRented: parseInt(summary.monthlyItemsRented) || 0,
        };

    } catch (error) {
        console.error("Error getAdminRentalSummary:", error);
        throw new Error('Gagal menghitung summary rental.');
    }
};


// --- 3. MEMPERBARUI STATUS PENGEMBALIAN
export const updateReturnStatus = async (rentalId, newStatus) => {
    const id = parseInt(rentalId);

    try{
        const updatedRental = await db
        .update(rentalsTable)
        .set({ 
            returnStatus: newStatus,
            // Jika statusnya 'Diterima', catat tanggal pengembalian
            returnDate: newStatus === 'Diterima' ? new Date() : undefined
        })
        .where(eq(rentalsTable.id, id))
        .returning();

    return updatedRental;
    }catch(error){
        console.error("Error updateReturnStatus:", error); 
        throw new Error('Gagal mengupdate return ke database.');
    }
};


export const updateOrderStatus = async (rentalId, newStatus) => {
    const id = parseInt(rentalId);

    // Periksa ID untuk keamanan
    if (isNaN(id)) throw new Error("ID Rental tidak valid."); 

    try{
        // Langsung update kolom orderStatus
        const [updatedRental] = await db
            .update(rentalsTable)
            .set({ 
                orderStatus: newStatus,
                // Kita tidak menyentuh returnStatus atau returnDate di sini
            })
            .where(eq(rentalsTable.id, id))
            .returning(); // Mengembalikan baris yang diupdate

        return updatedRental;
    }catch(error){
        console.error("Error updateOrderStatus:", error); 
        throw new Error('Gagal mengupdate status pesanan ke database.');
    }
};

export const updateItemReturnDetails = async (rentalId, productId, condition, fineAmount) => {
    
    // Asumsi: Kita hanya mengupdate item yang memiliki kondisi return baru
    const id = parseInt(rentalId);
    const prodId = parseInt(productId);
    
    if (isNaN(id) || isNaN(prodId)) {
        throw new Error("ID Rental atau Produk tidak valid.");
        }
    
    try {
        // UPDATE untuk mengubah detail penyewaan
        const updatedItem = await db
            .update(rentalsDetailTable)
            .set({ 
                condition: condition,  // Mengubah status kondisi
                fineAmount: fineAmount         // Menetapkan denda (numeric)
            })
            .where(and(
                eq(rentalsDetailTable.rentalId, id),
                eq(rentalsDetailTable.productId, prodId)
            ))
            .returning();
            
        return updatedItem;

    } catch (error) {
        console.error("Error updateItemReturnDetails:", error);
        throw new Error('Gagal memperbarui kondisi item dan denda.');
    }
};