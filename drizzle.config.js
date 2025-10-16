import { defineConfig } from "drizzle-kit";

export default defineConfig({
    // PERBAIKAN 1: Tambahkan DIALECT di tingkat atas (Wajib)
    dialect: 'postgresql', 

    schema: "./backend/db/schema",
    out: "./drizzle-migrate",
    
    // Perhatikan: driver di luar db: {} seringkali opsional, 
    // tetapi kita perlu memastikan driver yang benar di dalam db: {}

    db: {
        // PERBAIKAN 2: Tentukan DRIVER di dalam blok db.
        // Drizzle-Kit akan mengaitkan driver 'pg' ini dengan dialect 'postgresql'
        driver: 'pg', 
        connectionString: process.env.DATABASE_URL,
    },
});