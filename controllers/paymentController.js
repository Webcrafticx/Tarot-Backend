const Appointment = require('../models/appointment');
const Availability = require('../models/availabilty');
const { sendConfirmationEmail } = require('../services/emailService');
const crypto = require("crypto");
const razorpay = require("../utils/razorpay");
const {availabilityCache} = require('./availability');
const createPaymentOrder = async (req, res) => {
  try {
    const { name, email, phone, serviceType, selectedWindow, duration, price, location, selectedWindowDates } = req.body;

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

    const options = {
      amount: (price || 0) * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      message: 'Payment order created',
      data: {
        order,
        appointmentData: { name, email, phone, serviceType, selectedWindow, duration, price, location, selectedWindowDates }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating payment order', error: error.message });
  }
};



const verifyPaymentAndCreateAppointment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, appointmentData } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    if (appointmentData.selectedWindow) {
      const available = availabilityCache[appointmentData.selectedWindow]; 
      console.log('Cached availability for', appointmentData.selectedWindow, ':', availabilityCache);
      if (!available) {
        return res.status(400).json({
          success: false,
          message: 'Selected slot is no longer available'
        });
      }
    }

    // 3️⃣ Create appointment in DB
    const appointment = await Appointment.create({
      name: appointmentData.name,
      email: appointmentData.email,
      phone: appointmentData.phone,
      serviceType: appointmentData.serviceType,
      selectedWindow: appointmentData.selectedWindow || null,
      selectedWindowDates: appointmentData.selectedWindowDates,
      duration: appointmentData.duration || 20,
      location: appointmentData.location,
      price: appointmentData.price || 0,
      status: 'confirmed',
      paymentStatus: 'completed',
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id
    });

    // 4️⃣ Send email asynchronously (non-blocking)
    sendConfirmationEmail(appointment).catch(err => console.error('Email error:', err));

    // 5️⃣ Respond immediately
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
  verifyPaymentAndCreateAppointment
};
