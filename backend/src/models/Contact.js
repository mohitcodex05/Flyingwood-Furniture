const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ]
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'resolved'],
    default: 'new'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
