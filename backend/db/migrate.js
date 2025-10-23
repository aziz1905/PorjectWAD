import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from 'dotenv';
import path from 'path';

// Pemuatan environment secara eksplisit dari root proyek
// Ini harus dijalankan sebelum Pool dibuat.
config({ path: path.resolve(process.cwd(), '.env') });

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5440;


const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    host: process.env.DB_HOST,
    port: dbPort, // Pastikan ini adalah integer
    database: process.env.DB_NAME, 
});

const db = drizzle(pool);

// Fungsi Utama untuk Menjalankan Migrasi
async function runMigration() {
    console.log("Mulai Migrasi Drizzle...");
    try {
        await migrate(db, { migrationsFolder: './drizzle-migrate' }); 
        console.log("Migrasi Selesai!");
        
    } catch (error) {
        console.error("Gagal menjalankan migrasi:", error);
        process.exit(1);
    } finally {
        await pool.end(); 
    }
}

runMigration();