const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['College Project', 'School Project', 'Website', 'Mobile App', 'Web Application', 'AI/ML', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  features: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  price: {
    type: Number,
    required: true
  },
  images: [{
    type: String
  }],
  demoLink: String,
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    studentName: String,
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['Available', 'Sold', 'Custom Order'],
    default: 'Available'
  },
  // New fields for showcase enhancement
  views: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  completionTime: {
    type: String,
    default: '1-2 weeks'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
