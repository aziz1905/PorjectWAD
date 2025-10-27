import { pgEnum, pgTable, serial, integer, primaryKey } from 'drizzle-orm/pg-core';
import { productsTable } from './productsSchema.js';
import { rentalsTable } from './rentalsSchema.js';

export const itemCondition = pgEnum('item_condition_enum', ['Baik', 'Rusak_Ringan', 'Rusak_Berat']);

export const rentalsDetailTable = pgTable('rentalDetails', {
    rentalId: serial('rental_id').notNull().references(() => rentalsTable.id, { onDelete: 'cascade' }),
    productId: integer('product_id').notNull().references(() => productsTable.id),
    unitPrice: integer('unit_price').notNull(),
    duration: integer('duration').notNull(),
    unit: integer('unit').notNull(),
    subtotal: integer('durasi_hari').notNull(),
    condition: itemCondition('return_condition').default('Baik').notNull(),
    fineAmount: integer('fine_amount').default('0').notNull(),
}, (table) => ({
    // Kunci gabungan untuk detail item
    pk: primaryKey({ columns: [table.rentalId, table.productId] }), 
}));