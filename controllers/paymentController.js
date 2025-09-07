const Appointment = require('../models/appointment');
const Availability = require('../models/availabilty');
const { sendConfirmationEmail } = require('../services/emailService');

// Confirm appointment (after payment successful)
const confirmAppointment = async (appointmentId) => {
  try {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new Error('Appointment not found');
    }

    const availability = await Availability.findOne({ windowName: appointment.selectedWindow });
    if (!availability || !availability.isAvailable) {
      throw new Error(`No available slots for ${appointment.windowName}`);
    }

    // Mark appointment as confirmed and payment as done
    appointment.isConfirmed = true;
    appointment.paymentStatus = 'completed'; // if you have a paymentStatus field
    appointment.razorpayPaymentId = `dummy_pay_${Date.now()}`;
    appointment.razorpaySignature = `dummy_sig_${Math.random().toString(36).substring(2, 15)}`;
    await appointment.save();

    // Send confirmation email
    await sendConfirmationEmail(appointment);

    // Add to Google Calendar
    // const calendarEventId = await addToGoogleCalendar(appointment);
    // if (calendarEventId) {
    //   appointment.calendarEventId = calendarEventId;
    //   await appointment.save();
    // }

    return appointment;
  } catch (error) {
    console.error('Error confirming appointment:', error);
    throw error;
  }
};

// Create dummy order (simulates Razorpay order creation)
const createDummyOrder = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const order = {
      id: `order_dummy_${Date.now()}`,
      entity: 'order',
      amount: amount * 100,
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: `appointment_${appointmentId}`,
      status: 'created',
      attempts: 0,
      created_at: Date.now()
    };

    appointment.razorpayOrderId = order.id;
    await appointment.save();

    res.json({ success: true, message: 'Dummy order created successfully', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating dummy order', error: error.message });
  }
};

// Verify dummy payment (simulates payment verification & auto-confirms appointment)
const verifyDummyPayment = async (req, res) => {
  try {
    const { orderId, appointmentId } = req.body;

    const appointment = await confirmAppointment(appointmentId);

    res.json({
      success: true,
      message: 'Dummy payment verified and appointment confirmed',
      data: {
        appointment,
        paymentId: appointment.razorpayPaymentId
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying dummy payment', error: error.message });
  }
};

// Get dummy payment options (for frontend simulation)
const getDummyPaymentOptions = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    res.json({
      success: true,
      data: {
        appointmentId: appointment._id,
        amount: 500,
        currency: 'INR',
        name: appointment.name,
        email: appointment.email,
        description: `Appointment for ${appointment.serviceType} in ${appointment.windowName}`
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching payment options', error: error.message });
  }
};

module.exports = {
  createDummyOrder,
  verifyDummyPayment,
  getDummyPaymentOptions
};
