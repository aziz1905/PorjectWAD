import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const categoriesTable = pgTable('categories', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name_category", {length: 255 }).notNull().unique(),
});