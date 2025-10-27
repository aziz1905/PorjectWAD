import { integer, pgTable, varchar, text} from "drizzle-orm/pg-core";
import { usersTable } from "./usersSchema.js";


export const usersBiodataTable = pgTable('userBiodata', {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id").references(() => usersTable.id, {onDelete: 'cascade' }).notNull().unique(),
    phone: varchar("phone").notNull().default(''),
    address: text("address").notNull().default(''),
    profileImageUrl: text("imageUrl").notNull().default('')
});