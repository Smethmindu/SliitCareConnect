/**
 * MEMBER 1: Auth & User Management
 * AUTH CONTROLLER
 * This file contains the logic for user registration, login, and token verification.
 */
import { User } from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';
import Notification from '../models/Notification.js';

/**
 * REGISTER NEW USER
 * Creates a new student account, hashes the password, and notifies admins.
 */
export const register = async (req, res) => {
  try {
    console.log('Registration request body:', req.body);
    const { firstName, lastName, email, password, studentId } = req.body;
    const role = 'student';

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    console.log('Creating user with data:', { firstName, lastName, email, role, studentId });
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      studentId
    });

    console.log('User object created, attempting to save...');
    await user.save();
    console.log('User saved successfully');

    // Notify all admins about the new signup
    try {
      const admins = await User.find({ role: 'admin', _id: { $ne: user._id } }).select('_id');
      if (admins.length > 0) {
        await Notification.insertMany(
          admins.map((admin) => ({
            recipientId: admin._id.toString(),
            type: 'new_signup',
            message: `New student ${firstName} ${lastName} has signed up.`,
          }))
        );
        console.log(`Signup notification sent to ${admins.length} admin(s)`);
      }
    } catch (notifErr) {
      console.error('Failed to send signup notifications:', notifErr);
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.getProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: `Server error: ${error.message}`
    });
  }
};

/**
 * LOGIN USER
 * Authenticates a user by email/password and returns a JWT token for future requests.
 */
export const login = async (req, res) => {
  try {
    console.log('🔐 Login request received');
    const { email, password } = req.body;
    console.log('📧 Email:', email);
    console.log('🔑 Password provided:', password ? 'Yes' : 'No');

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user with password
    console.log('🔍 Looking for user with email:', email);
    const user = await User.findOne({ email }).select('+password');
    console.log('👤 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User not active');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    console.log('🔐 Comparing password...');

    const isPasswordValid = await user.comparePassword(password);
    console.log('✅ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('✅ Password matches, proceeding...');

    user.lastLogin = new Date();
    await user.save();

    // --- JWT TOKEN GENERATION ---
    // We sign a token containing the user's ID. 
    // This token is then sent back to the client and stored in localStorage.
    // It must be included in the 'Authorization' header for all protected API calls.
    const token = generateToken(user._id);

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * VERIFY TOKEN
 * Checks if a provided JWT token is valid and returns the user's profile.
 * Used by the frontend to maintain a logged-in state after page refresh.
 */
export const verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: user.getProfile()
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};
