const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// MongoDB Connection
const mongooseOptions = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
};

console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

mongoose.connect(process.env.MONGODB_URI, mongooseOptions)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('Database:', mongoose.connection.name);
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Connection URI (masked):', process.env.MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    console.log('\n💡 Tip: Make sure MongoDB service is running');
  });

// Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
