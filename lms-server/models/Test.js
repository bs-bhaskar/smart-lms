const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ['mcq', 'theory'], required: true },
  text: { type: String, required: true },
  options: [String], // For MCQ
  correctAnswer: String, // For MCQ
  maxMarks: Number, // For theory
  modelAnswer: String, // Optional, for theory
});

const testSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [questionSchema],
  published: { type: Boolean, default: false },
  duration: Number, // in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date }, // New field: expiry time
});

module.exports = mongoose.model('Test', testSchema); 