import db from '../db/db.js';
import { eq, sql } from 'drizzle-orm';
import { reviewsTable } from '../db/schema/reviewsSchema.js';
import { productsTable } from '../db/schema/productsSchema.js';

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