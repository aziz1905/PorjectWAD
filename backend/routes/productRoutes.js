import express from 'express';
import { createProduct, getProduct, getProductByid } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();



router.get('/', getProduct);
router.get('/:id', getProductByid);
router.post('/addProduct', authenticateToken, authorizerole('admin'), createProduct);

export default router;