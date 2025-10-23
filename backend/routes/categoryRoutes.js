import express from 'express';
import { createCategory, getAllCategories } from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();

router.post('/addCategory', authenticateToken, authorizerole('admin'), createCategory);
router.get('/', getAllCategories);

export default router;