import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
import { createReviews, getRecentReviews } from '../controllers/reviewsController.js';

const router = express.Router();
router.get('/', getRecentReviews);
router.post('/comment', authenticateToken, authorizerole('customer'), createReviews);

export default router;