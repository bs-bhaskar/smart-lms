const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  answer: String, // For MCQ: option, for theory: text
  marks: Number, // For theory, after grading
  feedback: String, // For theory, after grading
});

const submissionSchema = new mongoose.Schema({
  test: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [answerSchema],
  totalMarks: { type: Number, default: 0 },
  maxMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  graded: { type: Boolean, default: false },
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Submission', submissionSchema); 