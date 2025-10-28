import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import reviewsRouter from './routes/reviewsRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import rentalsRoutes from './routes/rentalRoutes.js';
import { connectDB } from './db/dbSetup.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({ // <--- TAMBAHKAN 'export' DI SINI
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);



const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json({ limit: '5mb' })); // Menaikkan batas untuk JSON payload
app.use(express.urlencoded({ extended: true, limit: '5mb' })); // Menaikkan batas untuk URL-encoded payload
app.use(express.static('public'));
app.use(cors());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRouter);
app.use('/wishlist', wishlistRouter);
app.use('/reviews', reviewsRouter);
app.use('/rentals', rentalsRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
});
