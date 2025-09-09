const Appointment = require('../models/appointment');
const Availability = require('../models/availabilty');
const { sendConfirmationEmail } = require('../services/emailService');



exports.getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.selectedWindow) {
      query.selectedWindow = req.query.selectedWindow;
    }

    const appointments = await Appointment.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalAppointments = await Appointment.countDocuments(query);
    const totalPages = Math.ceil(totalAppointments / limit);

    res.status(200).json({
      success: true,
      pagination: {
        totalAppointments,
        totalPages,
        currentPage: page,
        limit,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null
      },
      data: appointments
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};
