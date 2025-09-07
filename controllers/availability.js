const Availability = require('../models/availabilty');


const getAvailability = async (req, res) => {
  try {
    const windows = await Availability.find().sort({ windowName: 1 }).lean();
    res.json({
      success: true,
      data: windows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching availability windows',
      error: error.message
    });
  }
};


const setAvailability = async (req, res) => {
  try {
    const { windowName, isAvailable } = req.body;

    if (!windowName || !['Mon-Wed', 'Thu-Fri', 'Sat-Sun'].includes(windowName)) {
      return res.status(400).json({
        success: false,
        message: 'Valid windowName is required: Mon-Wed, Thu-Fri, or Sat-Sun'
      });
    }

    let availability = await Availability.findOne({ windowName });

    if (availability) {
      availability.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : availability.isAvailable;
    } else {
      availability = new Availability({
        windowName,
        isAvailable: typeof isAvailable === 'boolean' ? isAvailable : true
      });
    }

    await availability.save();

    res.json({
      success: true,
      message: 'Availability window updated successfully',
      data: availability
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating availability window',
      error: error.message
    });
  }
};

const deleteAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const availability = await Availability.findByIdAndDelete(id);

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'Availability window not found'
      });
    }

    res.json({
      success: true,
      message: 'Availability window deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting availability window',
      error: error.message
    });
  }
};

module.exports = {
  getAvailability,
  setAvailability,
  deleteAvailability
};
