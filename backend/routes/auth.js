import express from 'express';
import { register, login, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Verify token (for frontend to check if user is logged in)
router.get('/verify', verifyToken);

export default router;
