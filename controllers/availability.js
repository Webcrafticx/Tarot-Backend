const Availability = require('../models/availabilty');


let availabilityCache = {};

const loadAvailabilityCache = async () => {
  const windows = await Availability.find().lean();
  Object.keys(availabilityCache).forEach(key => delete availabilityCache[key]);

  // Populate
  windows.forEach(w => {
    availabilityCache[w.windowName] = w.isAvailable;
  });
    console.log('Availability cache loaded:', availabilityCache);

};

// const getAvailability = async (req, res) => {
//   try {
//     const windows = await Availability.find().sort({ windowName: 1 }).lean();
//     res.json({
//       success: true,
//       data: windows
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching availability windows',
//       error: error.message
//     });
//   }
// };

const getAvailability = async (req, res) => {
  try {
    if (Object.keys(availabilityCache).length === 0) {
      await loadAvailabilityCache();
    }

    const data = Object.keys(availabilityCache).map(windowName => ({
      windowName,
      isAvailable: availabilityCache[windowName]
    }));

    res.json({ success: true, data });
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

    const finalStatus = typeof isAvailable === 'boolean' ? isAvailable : true;

    // Update cache instantly
    availabilityCache[windowName] = finalStatus;

    // Update DB (async but awaited here to keep consistency)
    await Availability.updateOne(
      { windowName },
      { $set: { isAvailable: finalStatus } },
      { upsert: true }
    );

    res.json({
      success: true,
      message: 'Availability window updated successfully',
      data: { windowName, isAvailable: finalStatus }
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
    delete availabilityCache[availability.windowName];

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
  deleteAvailability,
  loadAvailabilityCache,
  availabilityCache
};
