import express from 'express';
import { createAccount, getUserById, loginAccount, updateBiodata, updateUserPassword } from '../controllers/userController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';
const router = express.Router();



//router.get('/', getAlluser);

router.post('/login', loginAccount);
router.post('/registrasi', createAccount);
router.get('/:id', authenticateToken, getUserById);
router.put('/password', authenticateToken, updateUserPassword);
router.put('/biodata', authenticateToken,authorizerole('customer') , updateBiodata);  

export default router;