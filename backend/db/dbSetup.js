import db from './db.js'; 
import { sql } from 'drizzle-orm'; 
export const connectDB = async () =>{
    try{
        await db.execute(sql`SELECT 1`); 
        console.log('✅ Koneksi Drizzle ke PostgreSQL berhasil diverifikasi!');
        return true;
    }catch(error) {
        console.error('❌ GAGAL terhubung ke database:', error.message);
        process.exit(1); 
    };
}
