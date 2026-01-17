const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userAuth = require('../middleware/userAuth');
const { notifyNewUser } = require('../config/email');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, college, course } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    
    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      college,
      course
    });
    
    await user.save();
    
    // Send email notification to admin (async, don't wait)
    notifyNewUser(user).catch(err => 
      console.log('Email notification failed:', err.message)
    );
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        course: user.course
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        college: user.college,
        course: user.course
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password')
      .populate('wishlist', 'title price images category');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.put('/profile', userAuth, async (req, res) => {
  try {
    const { name, phone, college, course } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone, college, course },
      { new: true }
    ).select('-password');
    
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to wishlist
router.post('/wishlist/:projectId', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user.wishlist.includes(req.params.projectId)) {
      return res.status(400).json({ message: 'Project already in wishlist' });
    }
    
    user.wishlist.push(req.params.projectId);
    await user.save();
    
    res.json({ message: 'Added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from wishlist
router.delete('/wishlist/:projectId', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.projectId
    );
    await user.save();
    
    res.json({ message: 'Removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get wishlist
router.get('/wishlist', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('wishlist', 'title price images category description technologies');
    
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
