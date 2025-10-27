import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import reviewsRouter from './routes/reviewsRoutes.js';
import { connectDB } from './db/dbSetup.js';
import { fileURLToPath } from 'url';
import path from 'path';
import uploadRouter from './routes/uploadRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
app.use('/upload', uploadRouter);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/wishlist', wishlistRouter);
app.use('/reviews', reviewsRouter);
app.use(express.static(path.join(__dirname, '../public')));

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
});
