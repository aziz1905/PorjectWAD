import express from 'express';
const router = express.Router();

import { getAlluser, GetUserById } from '../controllers/userController.js';

router.get('/', getAlluser);
router.get('/:id', GetUserById);

export default router;