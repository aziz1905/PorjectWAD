import { integer, pgTable, varchar, decimal, text, pgEnum } from "drizzle-orm/pg-core";
import { categoriesTable } from "./categoriesSchema.js";

export const productAgeEnum = pgEnum('product_age', ['Anak', 'Remaja', 'Dewasa']);
export const productGenderEnum = pgEnum('product_gender', ['Pria', 'Wanita', 'Unisex']);

export const productsTable = pgTable("products", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    categoryId: integer("category_id").references(() => categoriesTable.id, { onDelete: 'set null' }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    profilImageUrl: varchar("profil_image_url").notNull(),
    age: productAgeEnum('age').notNull().default('Dewasa'),
    gender: productGenderEnum('gender').notNull().default('Unisex'),
    rating: decimal("rating", { precision: 2, scale: 1 }).default('0.0'),
    rentCount: integer("rent_count").default(0),
});