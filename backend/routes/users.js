import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser
} from '../controllers/userController.js';

const router = express.Router();

// Get current user profile
router.get('/profile', authenticate, getProfile);

// Update current user profile
router.put('/profile', authenticate, updateProfile);

// Change password
router.put('/change-password', authenticate, changePassword);

// Admin routes

// Get all users (Admin only)
router.get('/', authenticate, authorize('admin'), getAllUsers);

// Create new user (Admin only)
router.post('/', authenticate, authorize('admin'), createUser);

// Get user by ID (Admin only)
router.get('/:id', authenticate, authorize('admin'), getUserById);

// Update user (Admin only)
router.put('/:id', authenticate, authorize('admin'), updateUser);

// Delete user (Admin only)
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

export default router;
