import { integer, pgTable, varchar, pgEnum, uniqueIndex} from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema.js";

export const productSize = pgEnum('name_size', ['S', 'M', 'L', 'XL', 'XXL']);

export const productsSizesTable = pgTable("productsSizes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id").references(() => productsTable.id, { onDelete: 'cascade' }),
    name: productSize('size').notNull(),
    stock: integer("stock").notNull().default(0),
}, (table) => { // Mendefinisikan setiap 
    return {
        productSizeUnique: uniqueIndex("product_size_unique").on(table.productId, table.name),
    };
});