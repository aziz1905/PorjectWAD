import express from 'express';
import { createAccount, loginAccount, updateBiodata } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();



//router.get('/', getAlluser);
//router.get('/:id', GetUserById);
router.post('/login', loginAccount);
router.post('/registrasi', createAccount);
router.put('/biodata', authenticateToken,authorizerole('customer'), updateBiodata);

export default router;