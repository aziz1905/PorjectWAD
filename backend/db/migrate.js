// backend/db/migrate.js

import { migrate } from 'drizzle-orm/node-postgres/migrator';
// Pastikan path ini benar ke file koneksi db Anda
import { db, pool } from '../index.js';


async function runMigration() {
  console.log('Mulai Migrasi Drizzle...');
  try {
    // Sesuaikan nama folder jika Anda pakai 'drizzle' bukan 'drizzle-migrate'
    await migrate(db, { migrationsFolder: './drizzle-migrate' }); 

    console.log('Migrasi berhasil.');
  } catch (error) {
    console.error('Gagal menjalankan migrasi:', error);
    process.exit(1); // Keluar dengan error
  } finally {
    // Tutup koneksi pool agar skrip bisa berhenti
    await pool.end();
    process.exit(0); // Keluar dengan sukses
  }
}

runMigration();