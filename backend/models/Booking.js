import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    counselorId: {
      type: String,
      required: [true, 'Counselor ID is required'],
    },
    counselorName: {
      type: String,
      required: [true, 'Counselor name is required'],
    },
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
    },
    sessionType: {
      type: String,
      enum: ['video', 'in-person', 'phone'],
      default: 'video',
    },
    notes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
