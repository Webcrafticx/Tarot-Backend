const { required } = require('joi');
const mongoose = require('mongoose');

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
  price: {
    type: Number,
    default: 0
  },
  location:{
    type: String,
    required: true,
    trim: true
    
  },
  serviceType: {
    type: String,
    required: true,
    trim: true
  },
  selectedWindow: {    
    type: String,
    enum: ['Mon-Wed', 'Thu-Fri', 'Sat-Sun'],
    default: null
  },
  duration: {          
    type: Number,
    default: 20
  },
  status: {            
    type: String,
    enum: ['pending', 'confirmed'],
    default: 'pending'
  },
  paymentStatus: {     
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

appointmentSchema.index({ email: 1 });        
appointmentSchema.index({ phone: 1 });        
appointmentSchema.index({ status: 1 });       
appointmentSchema.index({ createdAt: -1 });   
appointmentSchema.index(
  { email: 1, serviceType: 1, selectedWindow: 1 },
  { unique: false }
);

module.exports = mongoose.model('Appointment', appointmentSchema);
