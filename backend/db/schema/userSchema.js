import { integer, pgTable, varchar, text, pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum('user_role', ['customer', 'admin']);

export const usersTable = pgTable("Users", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name_user", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: text("password").notNull(),
    role: userRole('role').notNull().default('customer'),
});
