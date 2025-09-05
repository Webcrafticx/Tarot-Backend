const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
})

adminSchema.pre('save', async function(next){
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

adminSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)