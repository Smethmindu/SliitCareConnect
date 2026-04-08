import emailjs from 'emailjs-com';

// Initialize emailjs with your public key
// You'll need to replace this with your actual EmailJS public key
const EMAILJS_SERVICE_ID = 'service_0ce86eb';
const EMAILJS_TEMPLATE_ID = 'template_wno7ih1';
const EMAILJS_PUBLIC_KEY = 'OAEUN165Z_Y8HFjlC';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

/**
 * Send appointment booking email to counselor
 * @param {string} counselorEmail - Recipient email address (hardcoded to kalani2001926@gmail.com for demo)
 * @param {object} appointmentDetails - Appointment details object
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendBookingEmail = async (appointmentDetails) => {
  try {
    const {
      counselorName,
      studentName,
      date,
      time,
      sessionType,
      notes,
    } = appointmentDetails;

    // Email template parameters
    const templateParams = {
      to_email: 'kalani2001926@gmail.com', // Hardcoded for demonstration
      counselor_name: counselorName,
      student_name: studentName,
      appointment_date: date,
      appointment_time: time,
      session_type: sessionType,
      notes: notes || 'No additional notes',
      subject: `New Appointment Request from ${studentName}`,
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
