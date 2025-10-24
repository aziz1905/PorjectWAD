import { integer, pgTable, text, decimal, timestamp, uniqueIndex} from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema.js";
import { usersTable } from "./usersSchema.js";

export const reviewsTable = pgTable('reviews', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id").references(() => productsTable.id, {onDelete: 'cascade'}).notNull(),
    userId: integer("user_id").references(() => usersTable.id, {onDelete: 'cascade'}).notNull(),
    rating: decimal("rating", { precision: 2, scale: 1 }).default('0.0'),
    comment: text("comment"),
    createdAt: timestamp("created_at").defaultNow().notNull(),

},(table) => {
    return {
        reviewUnique: uniqueIndex("review_user_product_unique").on(table.productId, table.userId)
    }
});