import { integer, pgTable, varchar, decimal } from "drizzle-orm/pg-core";
import { categoriesTable } from "./categoriesSchema.js";


export const productsTable = pgTable("products", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: 'set null' }),
    name: varchar("name", { length: 255 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    imageUrl: varchar("image_url").notNull(),
    rating: decimal("rating", { precision: 2, scale: 1 }).default('0.0'),
    sold: integer("sold").default(0),
});