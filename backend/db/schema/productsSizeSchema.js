import { integer, pgTable, varchar, uniqueIndex} from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema.js";

export const productsSizesTable = pgTable("productsSizes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id").references(() => productsTable.id, { onDelete: 'cascade' }),
    name: varchar("name_size", { length: 255 }).notNull(),
    stock: integer("stock").notNull().default(0),
}, (table) => { // Mendefinisikan batasan di tingkat tabel
    return {
        productSizeUnique: uniqueIndex("product_size_unique").on(table.productId, table.name),
    };
});