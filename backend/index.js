import 'dotenv/config';
import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cors from 'cors';
import sequelize from './config/db.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);





