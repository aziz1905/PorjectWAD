import db from '../db/db.js';
import { eq, sql, desc } from 'drizzle-orm';
import { reviewsTable } from '../db/schema/reviewsSchema.js';
import { productsTable } from '../db/schema/productsSchema.js';
import { usersTable } from '../db/schema/usersSchema.js';
import { usersBiodataTable } from '../db/schema/usersBiodataSchema.js';

export const insertReviewsAndUpdateRating = async (reviewData) => {
    try{
        return await db.transaction(async (tx) => {
            const [newReview] = await tx // Ambil elemen pertama dari array
            .insert(reviewsTable)
            .values(reviewData)
            .returning();

            if(!newReview){
                throw new Error('Gagal membuat ulasan.');
            }

            const productId = newReview.productId;

            // menghitung rata-rata rating
            const [avgResult] = await tx // Ambil elemen pertama dari array
            .select({
                avgRating: sql`avg(${reviewsTable.rating})` 
            })
            .from(reviewsTable)
            .where(eq(reviewsTable.productId, productId));

            // Konversi hasil avgRating (yang bisa jadi string) ke format numerik 2,1
            const newAvgRating = parseFloat(avgResult.avgRating || 0).toFixed(1);
            
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
        if (error.message.includes('unique constraint')) {
            throw new Error("Anda sudah memberikan ulasan untuk produk ini.");
        }
        throw new Error("Gagal insert reviews/update rating.");
    }
};


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
