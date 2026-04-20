import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';
import Counselor from '../models/counselorModel.js';

// POST /api/bookings — Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { counselorId, counselorName, studentId, studentName, date, time, sessionType, notes } =
      req.body;

    const booking = await Booking.create({
      counselorId,
      counselorName,
      studentId,
      studentName,
      date,
      time,
      sessionType: sessionType || 'video',
      notes: notes || '',
      status: 'pending',
    });

    // Resolve the counselor's User _id from the Counselor profile
    try {
      const counselorProfile = await Counselor.findById(counselorId).select('userId');
      const recipientUserId = counselorProfile?.userId?.toString() || counselorId;

      await Notification.create({
        recipientId: recipientUserId,
        type: 'new_booking',
        message: `New appointment request from ${studentName} on ${date} at ${time}.`,
        bookingId: booking._id,
      });
    } catch (notifErr) {
      console.error('Failed to send booking notification:', notifErr);
    }

    res.status(201).json({
      status: 'success',
      data: booking,
    });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/student/:studentId — Get all bookings for a student
export const getStudentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.params.studentId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: 'success', data: bookings });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/counselor/:counselorId — Get all bookings for a counselor
export const getCounselorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ counselorId: req.params.counselorId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: 'success', data: bookings });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// PATCH /api/bookings/:id/status — Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'declined', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status value.' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ status: 'error', message: 'Booking not found.' });
    }

    // Notify the student about the status change
    let type = '';
    let statusLabel = status;
    if (status === 'confirmed') type = 'booking_confirmed';
    else if (status === 'declined') type = 'booking_declined';
    else if (status === 'completed') type = 'booking_completed';
    else type = 'booking_cancelled';

    await Notification.create({
      recipientId: booking.studentId,
      type: type,
      message: `Your booking with ${booking.counselorName} on ${booking.date} at ${booking.time} has been ${statusLabel}.`,
      bookingId: booking._id,
    });

    // If student cancels, also notify the counselor
    if (status === 'cancelled') {
      try {
        const counselorProfile = await Counselor.findById(booking.counselorId).select('userId');
        const recipientUserId = counselorProfile?.userId?.toString() || booking.counselorId;

        await Notification.create({
          recipientId: recipientUserId,
          type: 'booking_cancelled',
          message: `${booking.studentName} has cancelled their appointment on ${booking.date} at ${booking.time}.`,
          bookingId: booking._id,
        });
      } catch (notifErr) {
        console.error('Failed to send cancellation notification to counselor:', notifErr);
      }
    }

    res.status(200).json({ status: 'success', data: booking });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/bookings/slots/:counselorId?date=... — Get booked time slots for a counselor on a date
export const getBookedSlots = async (req, res) => {
  try {
    const { counselorId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ status: 'error', message: 'Date query parameter is required.' });
    }

    const bookings = await Booking.find({
      counselorId,
      date,
      status: { $nin: ['cancelled', 'declined'] },
    }).select('time');

    const bookedTimes = bookings.map((b) => b.time);

    res.status(200).json({ status: 'success', data: { bookedTimes } });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};
