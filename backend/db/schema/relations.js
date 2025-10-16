import { relations } from "drizzle-orm";
import { productsTable } from './productsSchema.js'; 
import { productsSizesTable } from './productsSizeSchema.js';
import { categoriesTable } from './categoriesSchema.js';


// Relasi Product memiliki banyak ProductSize
export const productRelations = relations(productsTable, ({ many, one }) => ({
    sizes: many(productsSizesTable),
    
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