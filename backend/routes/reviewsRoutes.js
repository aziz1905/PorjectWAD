import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
import { createReviews, getHomepageReviews} from '../controllers/reviewsController.js';


const router = express.Router();


router.post('/comment', authenticateToken, authorizerole('customer'), createReviews);
router.get('/beranda', getHomepageReviews);

export default router;