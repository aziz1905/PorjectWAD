import express from 'express';
import { getProduct, getProductByid } from '../controllers/productController.js';
const router = express.Router();



router.get('/', getProduct);
router.get('/:id', getProductByid);

export default router;