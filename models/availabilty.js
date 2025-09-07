const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  windowName: {  
    type: String,
    enum: ['Mon-Wed', 'Thu-Fri', 'Sat-Sun'],
    required: true
  },
  isAvailable: {  
    type: Boolean,
    default: true
  }
}, { timestamps: true });

availabilitySchema.index({ windowName: 1 });


module.exports = mongoose.model('Availability', availabilitySchema);
