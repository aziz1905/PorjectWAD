import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { addProductToWishlist, deleteProductFromWishlist, getWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', authenticateToken, getWishlist);
router.post('/:productId/addWishlist', authenticateToken, addProductToWishlist);
router.delete('/:productId', authenticateToken, deleteProductFromWishlist);

export default router;