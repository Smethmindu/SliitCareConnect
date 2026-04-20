import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  createBooking,
  getStudentBookings,
  getCounselorBookings,
  updateBookingStatus,
  getBookedSlots,
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', authenticate, createBooking);
router.get('/slots/:counselorId', getBookedSlots);
router.get('/student/:studentId', authenticate, getStudentBookings);
router.get('/counselor/:counselorId', authenticate, getCounselorBookings);
router.patch('/:id/status', authenticate, updateBookingStatus);

export default router;
