import { relations } from "drizzle-orm";
import { productsTable } from './productsSchema.js'; 
import { productsSizesTable } from './productsSizeSchema.js';
import { categoriesTable } from './categoriesSchema.js';
import { usersTable } from "./usersSchema.js";
import { usersBiodataTable } from "./usersBiodataSchema.js";
import { wishlistsTable } from "./wishlistSchema.js";
import { reviewsTable } from "./reviewsSchema.js";


// Relasi Product memiliki banyak ProductSize
export const productRelations = relations(productsTable, ({ many, one }) => ({
    sizes: many(productsSizesTable),
    
    // Relasi Product memiliki banyak Wishlist Item
    wishlist: many(wishlistsTable),

    // Relasi Product memiliki banyak reviews
    reviews: many(reviewsTable),

    // Relasi Product dimiliki satu Category
    category: one(categoriesTable, {
        fields: [productsTable.categoryId],
        references: [categoriesTable.id],
    }),
}));

// Relasi ProductSize dimiliki satu Product
export const productSizesRelations = relations(productsSizesTable, ({ one }) => ({
    product: one(productsTable, { // Menggunakan helper 'one'
        fields: [productsSizesTable.productId],
        references: [productsTable.id],
    }),
}));


// Relasi Category memiliki banyak Product
export const categoryRelations = relations(categoriesTable, ({ many }) => ({
    products: many(productsTable), // Menggunakan helper 'many'
}));

// Relasi user memiliki banyak biodata
export const userRelations = relations(usersTable, ({ many }) => ({
    userBiodata: many(usersBiodataTable),

    // Relasi User memiliki banyak Wishlist Item
    wishlist: many(wishlistsTable),

    // Satu user dapat memiliki banyak review.
    reviews: many(reviewsTable),
}));

// Relasi biodata dimiliki satu user
export const userBiodataRelations = relations(usersBiodataTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [usersBiodataTable.userId],
        references: [usersTable.id],
    }),
}));


// Relasi Wishlist (Menghubungkan user dan product)
export const wishlistRelations = relations(wishlistsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [wishlistsTable.userId],
        references: [usersTable.id],
    }),
    product: one(productsTable, {
        fields: [wishlistsTable.productId],
        references: [productsTable.id],
    }),
}));

export const reviewRelations = relations(reviewsTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [reviewsTable.userId],
        references: [usersTable.id],
    }),
    product: one(productsTable, {
        fields: [reviewsTable.productId],
        references: [productsTable.id],
    }),
}));