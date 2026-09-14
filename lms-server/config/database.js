const mongoose = require('mongoose');

async function connectDatabase(mongoUri) {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.error('Server will continue running, but database-backed routes may fail until MongoDB is available.');
    return false;
  }
}

module.exports = { connectDatabase };