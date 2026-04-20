import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: [true, 'Recipient ID is required'],
    },
    type: {
      type: String,
      enum: [
        'new_booking', 'booking_confirmed', 'booking_declined',
        'booking_cancelled', 'booking_completed',
        'new_signup', 'new_message', 'admin_broadcast'
      ],
      required: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
