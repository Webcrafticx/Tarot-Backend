const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendConfirmationEmail = async (appointment) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.email,
      subject: 'Appointment Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Appointment Confirmed</h2>
          <p>Dear ${appointment.name},</p>
          <p>Your appointment has been successfully booked. Here are your appointment details:</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Service:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${appointment.serviceType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Window:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${appointment.selectedWindow}</td>
            </tr>
            ${appointment.duration ? `
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd; background-color: #f9f9f9;"><strong>Duration:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${appointment.duration} minutes</td>
            </tr>` : ''}
          </table>
          <p>Thank you for choosing our service!</p>
          <br>
          <p>Best regards,<br>Appointment Booking Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', appointment.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

module.exports = { sendConfirmationEmail };
