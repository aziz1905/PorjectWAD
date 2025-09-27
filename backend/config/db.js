/*import pg from 'pg';
import { DB_CONFIG } from './config.js';

const { Pool } = pg;

const pool = new Pool(DB_CONFIG);

pool.query('SELECT NOW()')
    .then(res => {
        console.log('✅ Koneksi PostgreSQL berhasil!');
    })
    .catch(err => {
        console.error('❌ GAGAL terhubung ke database:', err.message);
        // Penting: Hentikan proses jika gagal agar server tidak berjalan tanpa DB
        process.exit(1); 
    });

export default pool;*/