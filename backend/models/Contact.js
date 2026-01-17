const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  projectTitle: String,
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed'],
    default: 'New'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contact', contactSchema);
