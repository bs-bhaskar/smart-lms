const Course = require('../models/Course');
const Timetable = require('../models/Timetable');
const User = require('../models/User');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');
const { getJwtSecretOrThrow } = require('../utils/jwt');

// Test and Results controller for teachers, students, and admin
const Test = require('../models/Test');
const Submission = require('../models/Submission');

exports.login = async (req, res) => {
  try {
    const { regNumber, password } = req.body;
    if (!regNumber || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ registrationNumber: regNumber, role: 'teacher' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, registrationNumber: user.registrationNumber },
      getJwtSecretOrThrow(),
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    console.log('Teacher dashboard request for teacherId:', teacherId);
    // Find courses taught by this teacher
    const courses = await Course.find({ teacher: teacherId })
      .populate('students', 'name email registrationNumber')
      .populate('timetable')
      .populate('comments.user', 'name');
    console.log('Found courses for teacher:', courses.length);
    // Collect timetables for these courses
    const timetables = await Timetable.find({ teacher: teacherId })
      .populate('course', 'title')
      .populate('students', 'name');
    console.log('Found timetables for teacher:', timetables.length);
    res.json({
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        students: c.students,
        resources: c.resources,
        comments: c.comments.map(comment => ({
          user: comment.user?.name || 'Unknown',
          text: comment.text,
          createdAt: comment.createdAt
        }))
      })),
      timetables
    });
  } catch (err) {
    console.error('Teacher dashboard error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.courses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ teacher: teacherId })
      .populate('students', 'name email registrationNumber')
      .populate('timetable')
      .populate('comments.user', 'name');
    res.json({
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        students: c.students,
        resources: c.resources,
        timetable: c.timetable,
        comments: c.comments.map(comment => ({
          user: comment.user?.name || 'Unknown',
          text: comment.text,
          createdAt: comment.createdAt
        }))
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.messenger = async (req, res) => {
  try {
    const teacherId = req.user.id;
    // Find all students in teacher's courses
    const courses = await Course.find({ teacher: teacherId }).populate('students', '_id');
    const studentIds = Array.from(new Set(courses.flatMap(c => c.students.map(s => s._id.toString()))));
    // Fetch messages sent by this teacher
    const messages = await Message.find({ sender: teacherId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json({ messages, recipients: studentIds });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content is required' });
    // Find all students in teacher's courses
    const courses = await Course.find({ teacher: teacherId }).populate('students', '_id');
    const studentIds = Array.from(new Set(courses.flatMap(c => c.students.map(s => s._id.toString()))));
    if (!studentIds.length) return res.status(400).json({ message: 'No students to send message to' });
    const message = await Message.create({ sender: teacherId, recipients: studentIds, content });
    res.json({ message: 'Message sent', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { messageId, content } = req.body;
    if (!content) return res.status(400).json({ message: 'Message content is required' });
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    if (String(message.sender) !== String(teacherId)) return res.status(403).json({ message: 'Not authorized to edit this message' });
    message.content = content;
    await message.save();
    res.json({ message: 'Message updated', data: message });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await User.findOne({ email, role: 'teacher' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    await sendEmail(email, 'LMS Password Reset OTP', `Your OTP is: ${otp}`);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { regNumber, otp, newPassword } = req.body;
    if (!regNumber || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ registrationNumber: regNumber, role: 'teacher' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.uploadResource = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Add resource to course
    course.resources.push({
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      uploadedAt: new Date()
    });
    await course.save();
    res.json({ message: 'Resource uploaded', resource: course.resources[course.resources.length - 1] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { courseId, text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.comments.push({ user: req.user.id, text });
    await course.save();
    await course.populate('comments.user', 'name');
    res.json({ comments: course.comments.map(comment => ({
      user: comment.user?.name || 'Unknown',
      text: comment.text,
      createdAt: comment.createdAt
    })) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { courseId, title, description } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    // Ensure the teacher owns the course
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    course.title = title || course.title;
    course.description = description || course.description;
    await course.save();
    res.json({ message: 'Course updated', course });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }
    const user = await User.findOne({ email, role: 'teacher' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || !user.otpExpires || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher: Create a new test
exports.createTest = async (req, res) => {
  try {
    const { title, description, course, questions, duration } = req.body;
    const test = await Test.create({
      title,
      description,
      course,
      questions,
      duration,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: 'Test created', test });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher: Publish/unpublish test
exports.publishTest = async (req, res) => {
  try {
    const { testId, published } = req.body;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    test.published = published;
    await test.save();
    res.json({ message: 'Test updated', test });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher: Get all tests for their courses
exports.getTeacherTests = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(c => c._id);
    const tests = await Test.find({ course: { $in: courseIds } });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Student: Get available tests for their courses
exports.getStudentTests = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await Course.find({ students: studentId }).select('_id');
    const courseIds = courses.map(c => c._id);
    const tests = await Test.find({ course: { $in: courseIds }, published: true });
    res.json({ tests });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Student: Submit test answers
exports.submitTest = async (req, res) => {
  try {
    const { testId, answers } = req.body;
    const studentId = req.user.id;
    // Prevent duplicate submissions
    const existing = await Submission.findOne({ test: testId, student: studentId });
    if (existing) return res.status(400).json({ message: 'Already submitted' });
    // Auto-grade MCQs
    const test = await Test.findById(testId);
    let totalMarks = 0;
    const gradedAnswers = answers.map(ans => {
      const q = test.questions.id(ans.questionId);
      if (q.type === 'mcq') {
        const correct = ans.answer === q.correctAnswer;
        const marks = correct ? 1 : 0;
        totalMarks += marks;
        return { ...ans, marks };
      } else {
        return { ...ans, marks: null };
      }
    });
    const submission = await Submission.create({
      test: testId,
      student: studentId,
      answers: gradedAnswers,
      totalMarks,
      graded: false,
    });
    res.status(201).json({ message: 'Test submitted', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher: Grade theory answers
exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId, gradedAnswers } = req.body;
    const submission = await Submission.findById(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });
    let totalMarks = 0;
    submission.answers = submission.answers.map(ans => {
      const graded = gradedAnswers.find(g => g.questionId === String(ans.questionId));
      if (graded) {
        ans.marks = graded.marks;
        ans.feedback = graded.feedback;
      }
      totalMarks += ans.marks || 0;
      return ans;
    });
    submission.totalMarks = totalMarks;
    submission.graded = true;
    await submission.save();
    res.json({ message: 'Submission graded', submission });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Student: View their results
exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.user.id;
    const submissions = await Submission.find({ student: studentId }).populate('test');
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Teacher: View all results for their tests
exports.getTeacherResults = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(c => c._id);
    const tests = await Test.find({ course: { $in: courseIds } }).select('_id');
    const testIds = tests.map(t => t._id);
    const submissions = await Submission.find({ test: { $in: testIds } }).populate('student test');
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin: View all results
exports.getAllResults = async (req, res) => {
  try {
    const submissions = await Submission.find().populate('student test');
    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 
