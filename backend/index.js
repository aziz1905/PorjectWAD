import express from 'express';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { PORT } from './config/config.js';

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});




