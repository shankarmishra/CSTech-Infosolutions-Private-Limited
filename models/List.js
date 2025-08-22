const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  agentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Agent',
    required: true
  },
  agentName: {
    type: String,
    required: true
  },
  uploadId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('List', ListSchema); 