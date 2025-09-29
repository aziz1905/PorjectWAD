import express from 'express';
const router = express.Router();

import { createAccount, getAlluser, GetUserById, loginAccount } from '../controllers/userController.js';

router.get('/', getAlluser);
router.get('/:id', GetUserById);
router.post('/login', loginAccount);
router.post('/registrasi', createAccount);

export default router;