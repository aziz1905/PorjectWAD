import db from '../db/db.js'; 
import { eq,sql,avg } from 'drizzle-orm';
import { productsTable } from '../db/schema/productsSchema.js';  
import { productsSizesTable } from '../db/schema/productsSizeSchema.js';
import { categoriesTable } from '../db/schema/categoriesSchema.js';
import { reviewsTable } from '../db/schema/reviewsSchema.js';


const productReturnAttributes = {
    id: productsTable.id,
    categoryId: productsTable.categoryId,
    name: productsTable.name,
    description: productsTable.description,
    price: productsTable.price,
    imageUrl: productsTable.imageUrl,
    age: productsTable.age,
    gender: productsTable.gender,
    rating: productsTable.rating,
    rentCount: productsTable.rentCount
};


export const findAllProducts = async (categoryId) => {
    let whereClause = undefined;

    if(categoryId){
        whereClause = eq(productsTable.categoryId, categoryId);
    }

    try {
        const products = await db
        .select({
            ...productReturnAttributes,
            sizeName: productsSizesTable.sizeName,
        })
        .from(productsTable)
        .leftJoin(productsSizesTable, eq(productsSizesTable.productId, productsTable.id)) 
        .where(whereClause);
        
        if (products.length === 0) {
            return undefined;
        }

        // pengelompokkan
        const groupProducts = products.reduce((acc, row) => {
            const productId = row.id;

            // Inisialisasi Produk jika belum ada di objek akumulator
            if(!acc[productId]){
                acc[productId] = {
                    ...row,
                    sizes: []
                }
            }

            const sizeName = row.sizeName;

            // Tambahkan ukuran ke array sizes jika sizeName ada
        if (row.sizeName && typeof row.sizeName === 'string' && !acc[productId].sizes.includes(sizeName)) {
            acc[productId].sizes.push(row.sizeName);
        }
            return acc;
        },{});

        const rawSizes = products
        .filter(row => row.sizeName !== null) 
        .map(row => row.sizeName);

        const uniqueSizes = [...new Set(rawSizes)];

        const finalProducts =Object.values(groupProducts).map(product => ({
            ...product,
            sizes: uniqueSizes.length > 0 ? uniqueSizes : "Stok Habis"
        }));
        
        return finalProducts;
    } catch (error) {
        console.error("Error findAllProducts:", error);
        throw new Error('Gagal mengambil produk dari database.');
    }
};


// Definisik Subquery Rata-rata Rating 
const avgProductRating = db
    .select({
        productId: reviewsTable.productId,
        // Gunakan AVG(rating)
        averageRating: avg(reviewsTable.rating).as('average_rating'),
        reviewCount: sql`count(${reviewsTable.id})`.as('review_count')
    })
    .from(reviewsTable)
    .groupBy(reviewsTable.productId)
    .as('rating_subquery');


export const findProductById = async (productId) => {
    const id = parseInt(productId);
    if (isNaN(id)) return undefined;

    try {
        const result = await db
            .select({
                ...productReturnAttributes,
                categoryName: categoriesTable.name,
                sizeName: productsSizesTable.sizeName,
                stock: productsSizesTable.stock,
                avgRating: avgProductRating.averageRating,
                reviewCount: avgProductRating.reviewCount,
            })
            .from(productsTable)
            .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id)) 
            .leftJoin(productsSizesTable, eq(productsSizesTable.productId, productsTable.id)) 
            .leftJoin(avgProductRating, eq(productsTable.id, avgProductRating.productId))
            .where(eq(productsTable.id, id));


        if (result.length === 0) {
            return undefined;
        }
        
        

        // proses pengelompokan sizes dan memeriksa stok
        const sizesArray = result
            .filter(row => row.sizeName !== null) 
            .map(row => {
                const stockAvailable = row.stock > 0 ? row.stock : "Stok Habis";
                
                return {
                    size: row.sizeName, 
                    stock: stockAvailable 
                }
            }); 

        const firstRow = result[0];
        
        // membandingkan dengan tipe data yang benar, dan menangani NULL/undefined

        // Ambil nilai rating dan review count dari firstRow
        const rawAverageRating = firstRow.avgRating;
        const rawReviewCount = firstRow.reviewCount;

        // Tentukan Rating Akhir
        const finalRating = rawAverageRating !== null && rawAverageRating !== undefined
                ? parseFloat(rawAverageRating).toFixed(1) 
                : 0.0;

        // Tentukan Total Review Akhir
        const finalReviewCount = rawReviewCount !== null && rawReviewCount !== undefined
                ? parseInt(rawReviewCount)
                : 0;
        
        const finalProduct = {
            id: firstRow.id,
            name: firstRow.name,
            description: firstRow.description,
            price: firstRow.price,
            imageUrl: firstRow.imageUrl,
            age: firstRow.age,
            gender: firstRow.gender,
            categoryName: firstRow.categoryName,
            sizes: sizesArray.length > 0 ? sizesArray : "Stok Habis",
            rating: finalRating,
            totalReviews: finalReviewCount
        }

    return finalProduct;
        

    } catch (error) {
        console.error("Error findProductById:", error);
        throw new Error('Gagal mencari detail produk di database.');
    }
};

export const insertProduct = async (productData, sizes) => {
    try{
        return await db.transaction(async (tx) => {
        
        const [newProduct] = await tx
            .insert(productsTable)
            .values(productData)
            .returning();

        // Cek dan mendapatkan ID
        if (!newProduct) {
            throw new Error('Failed to create product record.');
        }
        const newProductId = newProduct.id;
        
        const sizeInsertData = sizes.map(size => ({
            productId: newProductId,
            sizeName: size.sizeName,
            stock: size.stock,
        }));
        
        // 3. INSERT ke productsSizesTable
        await tx
            .insert(productsSizesTable)
            .values(sizeInsertData); 

        // Transaksi berhasil.
        return {
            ...newProduct,
            sizes: sizeInsertData,
        };
    });
    }catch(error){
        console.error("Error di addProduct repository:", error);
        throw new Error('Gagal menyimpan product ke database.'); 
    }
}

export const updateProduct = async (productId, productData, sizes) => {
    const id = parseInt(productId);
    if (isNaN(id)) {
        throw new Error("ID Produk tidak valid.");
    }

    try{
        return await db.transaction(async (tx) => {
        const update = await tx
        .update(productsTable)
        .set(productData)
        .where(eq(productsTable.id, id))
        .returning();

        
        if (!update) {
                return null;
            }
            
            // HAPUS semua size lama produk
            await tx
                .delete(productsSizesTable)
                .where(eq(productsSizesTable.productId, id));

            // data untuk size baru
            const sizeInsertData = sizes.map(size => ({
                productId: id,
                sizeName: size.sizeName,
                stock: size.stock,
            }));

            // 4. INSERT semua size baru
            if (sizeInsertData.length > 0) {
                await tx
                    .insert(productsSizesTable)
                    .values(sizeInsertData);
            }
            const updatedProduct = update[0];
            return {
                ...updatedProduct,
                sizes: sizeInsertData,
            };
        });
    }catch(error){
        console.error("Error updateProduct:", error);
        throw new Error('Gagal memperbarui produk dan stok di database.');
    }
}

export const updateProductRating = async (productId) => {
    try{
    // Hitung Rata-rata Rating yang baru
    const ratingResult = await db
        .select({
            averageRating: avg(reviewsTable.rating).as('average_rating')
        })
        .from(reviewsTable)
        .where(eq(reviewsTable.productId, productId));

    const newRating = parseFloat(ratingResult[0].averageRating) || 0.0;

    // 2. UPDATE nilai baru ke productsTable
    await db
        .update(productsTable)
        .set({ rating: newRating }) // Set kolom rating dengan nilai baru
        .where(eq(productsTable.id, productId));

    return newRating;
    }catch{
        console.error("Error di updateProductRating repository:", error);
        throw new Error('Gagal mengupdate rating ke database.'); 
    }
};

export const removeFromProduct = async(productId) => {
    try{
        const result = await db
        .delete(productsTable)
        .where(eq(productsTable.id, productId))
        .returning({id: productsTable.id});

        return result.length;
    }catch(error){
        console.error("Error di removeFromProduct repository:", error);
        throw new Error('Gagal menghapus product database.'); 
    }
}