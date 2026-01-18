const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const User = require('../models/User');
const AdminSettings = require('../models/AdminSettings');
const auth = require('../middleware/auth');
const { upload, deleteImage } = require('../config/cloudinary');

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if custom password exists in database
    const customPassword = await AdminSettings.findOne({ key: 'admin_password' });
    const adminPassword = customPassword ? customPassword.value : process.env.ADMIN_PASSWORD;
    
    if (email === process.env.ADMIN_EMAIL && password === adminPassword) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects (admin)
router.get('/projects', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create project
router.post('/projects', auth, upload.array('images', 5), async (req, res) => {
  try {
    const projectData = {
      ...req.body,
      features: JSON.parse(req.body.features || '[]'),
      technologies: JSON.parse(req.body.technologies || '[]'),
      images: req.files ? req.files.map(f => f.path) : [] // Cloudinary returns full URL in f.path
    };
    
    const project = new Project(projectData);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update project
router.put('/projects/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      features: JSON.parse(req.body.features || '[]'),
      technologies: JSON.parse(req.body.technologies || '[]')
    };
    
    // If new images are uploaded, delete old ones and use new ones
    if (req.files && req.files.length > 0) {
      const project = await Project.findById(req.params.id);
      
      // Delete old images from Cloudinary
      if (project && project.images) {
        for (const imageUrl of project.images) {
          await deleteImage(imageUrl);
        }
      }
      
      updateData.images = req.files.map(f => f.path); // Cloudinary URLs
    }
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete project
router.delete('/projects/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    // Delete images from Cloudinary
    if (project && project.images) {
      for (const imageUrl of project.images) {
        await deleteImage(imageUrl);
      }
    }
    
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all contacts
router.get('/contacts', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update contact status
router.put('/contacts/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete contact
router.delete('/contacts/:id', auth, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user status
router.put('/users/:id/status', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset user password (Admin only)
router.put('/users/:id/reset-password', auth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all reviews
router.get('/reviews', auth, async (req, res) => {
  try {
    const projects = await Project.find().select('title reviews');
    
    // Flatten all reviews with project info
    const allReviews = [];
    projects.forEach(project => {
      project.reviews.forEach(review => {
        allReviews.push({
          _id: review._id,
          projectId: project._id,
          projectTitle: project.title,
          userName: review.studentName,
          rating: review.rating,
          comment: review.comment,
          status: review.status || 'pending',
          createdAt: review.date
        });
      });
    });
    
    // Sort by date (newest first)
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update review status
router.put('/reviews/:reviewId/status', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;
    
    // Find project containing this review
    const project = await Project.findOne({ 'reviews._id': reviewId });
    if (!project) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Update review status
    const review = project.reviews.id(reviewId);
    review.status = status;
    await project.save();
    
    res.json({ message: 'Review status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete review
router.delete('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    // Find project containing this review
    const project = await Project.findOne({ 'reviews._id': reviewId });
    if (!project) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Remove review
    project.reviews.pull(reviewId);
    await project.save();
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Change admin password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    // Create/Update admin settings in database
    const AdminSettings = require('../models/AdminSettings');
    
    let settings = await AdminSettings.findOne({ key: 'admin_password' });
    
    if (settings) {
      settings.value = newPassword;
      await settings.save();
    } else {
      settings = await AdminSettings.create({
        key: 'admin_password',
        value: newPassword
      });
    }
    
    res.json({ 
      message: 'Password changed successfully! Please login again with new password.',
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Clear all reviews
router.delete('/clear-reviews', auth, async (req, res) => {
  try {
    const projects = await Project.find();
    
    for (const project of projects) {
      project.reviews = [];
      await project.save();
    }
    
    res.json({ message: 'All reviews cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
