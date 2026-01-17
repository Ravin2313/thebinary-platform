const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const userAuth = require('../middleware/userAuth');
const { notifyNewReview } = require('../config/email');

// Get all projects
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const projects = await Project.find(query).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Increment view count
router.post('/:id/view', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ views: project.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review to project (Login required)
router.post('/:id/review', userAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Add user info to review
    const review = {
      studentName: req.user.name,
      userId: req.userId,
      rating: req.body.rating,
      comment: req.body.comment
    };
    
    project.reviews.push(review);
    await project.save();
    
    // Send email notification to admin (async, don't wait)
    notifyNewReview({
      userName: req.user.name,
      rating: req.body.rating,
      comment: req.body.comment
    }, project.title).catch(err => 
      console.log('Email notification failed:', err.message)
    );
    
    res.json({ message: 'Review added successfully', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
