const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { notifyNewContact } = require('../config/email');

// Submit contact form
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    
    // Send email notification to admin (async, don't wait)
    notifyNewContact(contact).catch(err => 
      console.log('Email notification failed:', err.message)
    );
    
    res.status(201).json({ 
      message: 'Contact request submitted successfully!',
      contact 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
