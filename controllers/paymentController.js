const Appointment = require('../models/appointment');
const Availability = require('../models/availabilty');
const { sendConfirmationEmail } = require('../services/emailService');

const createPaymentOrder = async (req, res) => {
  try {
    const { name, email, phone, serviceType, selectedWindow, duration, price, location } = req.body;

    // Validate slot availability
    if (selectedWindow) {
      const availability = await Availability.findOne({ windowName: selectedWindow, isAvailable: true });
      if (!availability) {
        return res.status(400).json({
          success: false,
          message: 'Selected slot is not available'
        });
      }
    }

    const order = {
      id: `order_${Date.now()}`,
      amount: (price || 0) * 100,
      currency: 'INR',
      receipt: `temp_${Date.now()}`,
      status: 'created'
    };

    res.json({
      success: true,
      message: 'Payment order created',
      data: {
        order,
        appointmentData: { name, email, phone, serviceType, selectedWindow, duration, price, location }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment order', error: error.message });
  }
};

const verifyPaymentAndCreateAppointment = async (req, res) => {
  try {
    const { paymentId, orderId, appointmentData } = req.body;

    if (appointmentData.selectedWindow) {
      const availability = await Availability.findOne({ windowName: appointmentData.selectedWindow, isAvailable: true });
      if (!availability) {
        return res.status(400).json({
          success: false,
          message: 'Selected slot is no longer available'
        });
      }
    }

    const appointment = await Appointment.create({
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      serviceType: appointmentData.serviceType,
      selectedWindow: appointmentData.selectedWindow || null,
      duration: appointmentData.duration || 20,
      location: appointmentData.location,
      price: appointmentData.price || 0,
      status: 'confirmed',
      paymentStatus: 'completed',
      razorpayPaymentId: paymentId || null,
      razorpayOrderId: orderId || null
    });

    await sendConfirmationEmail(appointment);

    res.json({
      success: true,
      message: 'Payment verified, appointment created & confirmed',
      data: { appointmentId: appointment._id, status: appointment.status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment', error: error.message });
  }
};



module.exports = {
  createPaymentOrder,
  verifyPaymentAndCreateAppointment,
};
