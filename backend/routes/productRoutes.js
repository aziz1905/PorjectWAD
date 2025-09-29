import express from 'express';
const router = express.Router();

import { getAllProduct,getProductByid } from '../controllers/productController.js';

router.get('/', getAllProduct);
router.get('/:id', getProductByid);




export default router;