import express from 'express';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();

router.post('/profileImage', upload.single('imageUrl'), authenticateToken , authorizerole('customer'), uploadImage );
router.post('/productImage', upload.single('imageUrl'), authenticateToken , authorizerole('admin'), uploadImage );

export default router;