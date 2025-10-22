import { integer, pgTable, pgEnum, uniqueIndex} from "drizzle-orm/pg-core";
import { productsTable } from "./productsSchema.js";

export const productSize = pgEnum('product_size', ['S', 'M', 'L', 'XL', 'XXL']);

export const productsSizesTable = pgTable("productsSizes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id").references(() => productsTable.id, { onDelete: 'cascade' }).notNull(),
    sizeName: productSize('size_name').notNull(),
    stock: integer("stock").notNull().default(0),
}, (table) => { // Mendefinisikan setiap product memiliki 1 size (size tidak double)
    return {
        productSizeUnique: uniqueIndex("product_size_unique").on(table.productId, table.sizeName),
    };
});