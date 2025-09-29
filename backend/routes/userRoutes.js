import express from 'express';
import { createAccount, getAlluser, GetUserById, loginAccount } from '../controllers/userController.js';
const router = express.Router();



router.get('/', getAlluser);

router.get('/:id', GetUserById);
router.post('/login', loginAccount);
router.post('/registrasi', createAccount);

export default router;