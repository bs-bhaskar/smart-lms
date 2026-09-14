const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Registration
router.post('/register', studentController.register);
// Login
router.post('/login', studentController.login);
// Password management (public)
router.post('/forgot-password', studentController.forgotPassword);
router.post('/reset-password', studentController.resetPassword);
router.post('/verify-otp', studentController.verifyOtp);

// Parent Report (public - accessed through QR)
router.get('/parent-report/:studentId', studentController.parentReport);

// Protect all routes below
router.use(authenticateJWT, authorizeRoles('student'));

// Dashboard
router.get('/dashboard', studentController.dashboard);
// Profile
router.get('/profile', studentController.profile);
// Study Bot
router.get('/study-bot', studentController.studyBot);
router.post('/study-bot', studentController.studyBot);
// Timetable
router.get('/timetable', studentController.timetable);
// Student messages from teachers
router.get('/messages', studentController.messages);
// Comments on courses
router.post('/courses/:courseId/comment', studentController.addCourseComment);
router.get('/courses/:courseId/comments', studentController.getCourseComments);

module.exports = router; 