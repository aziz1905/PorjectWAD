import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'postgresql', 
    dbCredentials: {
        url: "postgresql://kostum_kita:admin123@localhost:5440/db_final_project"
    },
    schema: "./backend/db/schema",
    out: "./drizzle-migrate",

    db: {
        driver: 'pg', 
        connectionString: process.env.DATABASE_URL,
    },
});