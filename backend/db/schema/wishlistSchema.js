import { integer, pgTable, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./usersSchema.js";
import { productsTable } from "./productsSchema.js"; 

export const wishlistsTable = pgTable("wishlist", {
    userId: integer("user_id").references(() => usersTable.id, { onDelete: 'cascade' }).notNull(),
    productId: integer("product_id").references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.userId, table.productId] }),
    };
});