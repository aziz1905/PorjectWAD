import db from '../db/db.js';
import { eq, and } from 'drizzle-orm';
import { wishlistsTable } from '../db/schema/wishlistSchema.js';
import { productsTable } from '../db/schema/productsSchema.js';

export const addToWishlist = async (userId, productId) => {
    const newWishlistItem = await db
        .insert(wishlistsTable)
        .values({
            userId: userId,
            productId: productId,
        })
        .returning();
        
    return newWishlistItem;
};

export const getWishlistByUserId = async (userId) => {
    const wishlist = await db
        .select({
            product: productsTable, 
            addedAt: wishlistsTable.createdAt
        })
        .from(wishlistsTable)
        .innerJoin(productsTable, eq(wishlistsTable.productId, productsTable.id))
        .where(eq(wishlistsTable.userId, userId));
        
    // Mengembalikan array objek yang mengandung detail produk
    return wishlist.map(item => ({ ...item.product, addedAt: item.addedAt }));
};

export const removeFromWishlist = async (userId, productId) => {
    const result = await db
        .delete(wishlistsTable)
        .where(and(
            eq(wishlistsTable.userId, userId),
            eq(wishlistsTable.productId, productId)
        ))
        .returning({ id: wishlistsTable.productId });

    return result.length; // Mengembalikan jumlah baris yang dihapus
};