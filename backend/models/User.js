/**
 * MEMBER 1: Auth & User Management
 * USER MODEL
 * This file defines the structure of a user in the database, including validation and security.
 */
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// --- SCHEMA DEFINITION ---
// Defines the fields for Students, Counselors, and Admins
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'counselor', 'admin'],
    default: 'student'
  },
  profilePicture: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  studentId: {
    type: String,
    trim: true,
    required: function() {
      return this.role === 'student';
    }
  },
  dateOfBirth: {
    type: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// --- MIDDLEWARE & HOOKS ---

// Automatically hash the password before saving it to the database
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// --- INSTANCE METHODS ---

// Compare a provided password with the hashed password in the DB
userSchema.methods.comparePassword = async function (candidatePassword) {
  const stored = this.password ?? '';
  const looksHashed = typeof stored === 'string' && /^\$2[aby]\$\d{2}\$/.test(stored);

  if (!looksHashed) {
    const isMatch = String(candidatePassword) === String(stored);
    if (isMatch) {
      // --- SECURITY UPGRADE ---
      // If the user logs in with a plaintext password (legacy), 
      // we automatically hash it and save the update to bring 
      // the account up to modern security standards.
      this.password = candidatePassword;
      await this.save();
    }
    return isMatch;
  }

  return await bcrypt.compare(candidatePassword, stored);
};

// Helper to return only non-sensitive data to the frontend
userSchema.methods.getProfile = function() {
  return {
    id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    role: this.role,
    profilePicture: this.profilePicture,
    studentId: this.studentId,
    isEmailVerified: this.isEmailVerified,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

export const User = mongoose.model('User', userSchema);
