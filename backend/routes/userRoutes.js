import express from 'express';
import { createAccount, getUserById, loginAccount, updateBiodata, updateUserPassword } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { uploadImage } from '../controllers/uploadController.js';
const router = express.Router();



//router.get('/', getAlluser);

router.post('/login', loginAccount);
router.post('/registrasi', createAccount);
router.get('/:id', authenticateToken, getUserById);
router.put('/password', authenticateToken, updateUserPassword);
router.post('/upload/profile', authenticateToken, upload.single('profileImage'), uploadImage );
router.put('/biodata', authenticateToken,authorizerole('customer') , updateBiodata);  // mengambil imageUrl dari /upload/profile

export default router;