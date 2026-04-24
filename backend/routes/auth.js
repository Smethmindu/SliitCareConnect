/**
 * MEMBER 1: Auth & User Management
 * AUTHENTICATION ROUTES
 * Defines endpoints for user registration, login, and token verification.
 */
import express from 'express';
import { register, login, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/register - Create a new user account
router.post('/register', register);

// POST /api/auth/login - Authenticate user and return a JWT token
router.post('/login', login);

// GET /api/auth/verify - Validate an existing JWT token to maintain session
router.get('/verify', verifyToken);

export default router;
