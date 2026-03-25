import express from 'express';
import {
  createBooking,
  getStudentBookings,
  getCounselorBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';

const router = express.Router();

router.post('/', createBooking);
router.get('/student/:studentId', getStudentBookings);
router.get('/counselor/:counselorId', getCounselorBookings);
router.patch('/:id/status', updateBookingStatus);

export default router;
