import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wishlistRouter from './routes/wishlistRoutes.js';
import reviewsRouter from './routes/reviewsRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import { connectDB } from './db/dbSetup.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/upload', uploadRouter);
app.use('/wishlist', wishlistRouter);
app.use('/reviews', reviewsRouter);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    });
});
