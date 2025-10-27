import db from '../db/db.js';
import { eq, sql,desc} from 'drizzle-orm';
import { reviewsTable } from '../db/schema/reviewsSchema.js';
import { productsTable } from '../db/schema/productsSchema.js';
import { usersTable } from '../db/schema/usersSchema.js';


//untuk menginput comment dan update rating
export const insertReviewsAndUpdateRating = async (reviewData) => {
    try{
        return await db.transaction(async (tx) => {
            const newReview = await tx
            .insert(reviewsTable)
            .values(reviewData)
            .returning();

            if(!newReview){
                throw new Error('Gagal membuat ulasan.');
            }

            const productId = newReview.productId;

            // menghitung rata-rata rating
            const avgResult = await tx
            .select({
                avgRating: sql`CAST(AVG(${reviewsTable.rating}) AS NUMERIC(2, 1))`.as('avg_rating')
            })
            .from(reviewsTable)
            .where(eq(reviewsTable.productId, productId));

            const newAvgRating = avgResult.avgRating;

            const finalRating = newAvgRating || '0.0';

            // update rata-rata rating ke product
            await tx
                .update(productsTable)
                .set({ rating: finalRating })
                .where(eq(productsTable.id, productId));

                return newReview;
        });
    }catch(error){
        console.error("Error in insertReviewsAndUpdateRating: ", error);
        throw new Error("Gagal insert reviews/update rating.");
    }
};

export const findAllReviews = async () => {
    try{
        const result = await db
        .select({
            reviewId: reviewsTable.id,
            productId: productsTable.id,
            productName: productsTable.name,
            userName: usersTable.name,
            rating: reviewsTable.rating,
            comment: reviewsTable.comment,
            createdAt: reviewsTable.createdAt, 
        })
        .from(reviewsTable)
        .innerJoin(productsTable, eq(productsTable.productId, reviewsTable.id)) 
        .innerJoin(usersTable, eq(usersTable.userId, reviewsTable.id)) 
        
        return result;
    }catch(error){
        console.error("Error findAllReviews:", error);
        throw new Error('Gagal mengambil reviews dari database.');
    }
}

//untuk mengambil reviews sesuai id product
export const findReviewsByProductId = async (productId) => {
    const id = parseInt(productId);
    if(isNaN(id)){
        throw new Error("ID Produk tidak valid.");
    }

    try{
        const result = await db
        .select({
            reviewId: reviewsTable.id,
            userName: usersTable.name,
            rating: reviewsTable.rating,
            comment: reviewsTable.comment,
            createdAt: reviewsTable.createdAt,
        })
        .from(reviewsTable)
        .innerJoin(usersTable, eq(usersTable.id, reviewsTable.userId))
        .where(eq(reviewsTable.productId, id))
        .orderBy(desc(reviewsTable.createdAt)) // urut dari yang terbaru

        const totalReviews = result.length;

        const finalProses = {
            data: result,
            totalCount: totalReviews, 
            message: totalReviews > 0 ? "Review berhasil diambil." : "Produk belum memiliki review."
        };

        return finalProses;

    }catch(error){
        console.error("Error in getReviewsByProductId:", error);
        throw new Error('Gagal mengambil data review dari database.');
    }
}


// --- FUNGSI YANG BARU DITAMBAHKAN (DENGAN PERBAIKAN) ---
export const findRecentReviews = async (limit = 3) => {
    try {
        // 1. Ambil data secara "datar" (flat select)
        const results = await db
            .select({
                // Bidang ulasan
                id: reviewsTable.id,
                rating: reviewsTable.rating,
                comment: reviewsTable.comment,
                createdAt: reviewsTable.createdAt,
                
                // Bidang pengguna (datar dengan alias)
                userName: usersTable.name,
                userAvatar: usersBiodataTable.imageUrl, // Akan bernilai null jika tidak ada biodata
                
                // Bidang produk (datar dengan alias)
                productName: productsTable.name,
                productImage: productsTable.imageUrl
            })
            .from(reviewsTable)
            .innerJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
            .innerJoin(productsTable, eq(reviewsTable.productId, productsTable.id))
            .leftJoin(usersBiodataTable, eq(reviewsTable.userId, usersBiodataTable.userId))
            .orderBy(desc(reviewsTable.createdAt))
            .limit(limit);
            
        // 2. Susun ulang (remap) data menjadi struktur bersarang yang diharapkan frontend
        const finalResults = results.map(row => ({
            id: row.id,
            rating: row.rating,
            comment: row.comment,
            createdAt: row.createdAt,
            user: {
                name: row.userName,
                avatarUrl: row.userAvatar // Nilai ini akan null atau berisi string URL
            },
            product: {
                name: row.productName,
                imageUrl: row.productImage
            }
        }));

        return finalResults;

    } catch (error) {
        console.error("Error in findRecentReviews: ", error);
        throw new Error("Gagal mengambil data ulasan.");
    }
};