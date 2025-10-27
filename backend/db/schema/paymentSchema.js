import { pgEnum, pgTable, serial, integer, varchar,text, timestamp } from 'drizzle-orm/pg-core';
import { rentalsTable } from './rentalsSchema.js';

export const paymentMethod = pgEnum('payment_method_enum', ['Transfer', 'Bayar_Tunai_di_Mitra', 'E_Wallet', 'COD']);
export const paymentStatus = pgEnum('payment_status_enum', ['PENDING', 'SUCCESS', 'FAILED', 'EXPIRED', 'CANCELED' ]);

export const paymentsTable = pgTable('payments', {
    id: serial('id').primaryKey(),
    rentalId: integer('rental_id').notNull().references(() => rentalsTable.id, { onDelete: 'restrict' }),
    amount : integer('amount').notNull(),
    paymentMethod: paymentMethod('payment_method').notNull(),
    payStatus: paymentStatus('payment_status').default('PENDING').notNull(),
    transactionCode: varchar('transaction_code', { length: 255 }), 
    receiptUrl: text('receipt_url'),
    paymentDate: timestamp('payment_date'),
});