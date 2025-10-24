import express from 'express';
import { createAccount, loginAccount, updateBiodata } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
import { uploadImage } from '../controllers/uploadController.js';
const router = express.Router();



//router.get('/', getAlluser);
//router.get('/:id', GetUserById);
router.post('/login', loginAccount);
router.post('/registrasi', createAccount);
router.post('/upload/profile', authenticateToken, upload.single('profileImage'), uploadImage );
router.put('/biodata', authenticateToken,authorizerole('customer') , updateBiodata);  // mengambil imageUrl dari /upload/profile

export default router;