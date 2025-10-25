import express from 'express';
import { createProduct, deleteProduct, getProduct, getProductDetail, getProductReviews,  } from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();



router.get('/', getProduct);
router.get('/:id', getProductDetail);
router.get('/:productId/reviews', getProductReviews);
router.post('/addProduct', authenticateToken, authorizerole('admin'), createProduct);
router.delete('/:productId', authenticateToken, authorizerole('admin'), deleteProduct);

export default router;