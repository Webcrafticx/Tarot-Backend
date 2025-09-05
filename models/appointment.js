const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
 name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  serviceType: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 20 
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'completed', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   razorpayOrderId: {
//     type: String
//   },
//   razorpayPaymentId: {
//     type: String
//   },
//   razorpaySignature: {
//     type: String
//   },
//   calendarEventId: {
//     type: String
//   }
}, {
  timestamps: true
});

appointmentSchema.index({date: 1, timeSlot:1},{unique: true})
appointmentSchema.index({email: 1})
appointmentSchema.index({phone: 1})
appointmentSchema.index({status:1})
appointmentSchema.index({createdAt:1})

module.exports = mongoose.model('Appointment', appointmentSchema)