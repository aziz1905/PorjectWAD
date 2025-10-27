import { pgEnum, pgTable,serial, integer, text, timestamp} from 'drizzle-orm/pg-core';
import { usersTable } from './usersSchema.js';

export const paymentMethod = pgEnum('payment_method_enum', ['Transfer', 'Bayar_Tunai_di_Mitra', 'E_Wallet', 'COD']);
export const status = pgEnum('order_status_enum', ['Menunggu_Tujuan_Anda', 'Terkirim', 'Anda_pinjam', 'Selesai', 'Dibatalkan']);
export const returnStatus = pgEnum('return_status_enum', ['Belum_Dikembalikan', 'Diajukan', 'Diterima', 'Selesai']);

export const rentalsTable = pgTable('rentals', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => usersTable.id),
    totalProduct: integer('total_product').notNull(),
    shippingCost: integer('shipping_cost').notNull(),
    totalPayment: integer('total_payment').notNull(),
    shippingAddress: text('shipping_address').notNull(),
    paymentMethod: paymentMethod('payment_method').notNull(),
    orderStatus: status('order_status').default('Menunggu_Tujuan_Anda').notNull(),
    orderDate: timestamp('order_date').defaultNow(),
    returnStatus: returnStatus('return_status').default('Belum_Dikembalikan').notNull(),
    returnDate: timestamp('return_date'),
});