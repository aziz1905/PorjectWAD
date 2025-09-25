import express from 'express';
import pg from 'pg';

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// --- Konfigurasi Koneksi Database PostgreSQL ---
// Ganti nilai-nilai di bawah ini dengan kredensial PostgreSQL Anda
const pool = new Pool({
  user: 'db_admin',
  host: 'localhost',
  database: 'university_db',
  password: 'mypassword',
  port: 5433, // Port default PostgreSQL
});

// Coba tes koneksi ke database
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Gagal terhubung ke database PostgreSQL:', err);
  } else {
    console.log('✅ Terhubung ke PostgreSQL pada:', res.rows[0].now);
  }
});

// --- Rute API (Endpoints) ---
app.get('/', (req, res) => {
  res.send('Selamat datang di server backend KostumKita dengan PostgreSQL!');
});

// Contoh rute untuk mengambil data dari tabel 'products'
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data produk', error: err.message });
  }
});

// --- Menjalankan Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});