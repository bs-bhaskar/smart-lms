const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const upload = require('../utils/upload');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const testController = require('../controllers/testController');

// Login
router.post('/login', teacherController.login);
// Password management (public)
router.post('/forgot-password', teacherController.forgotPassword);
router.post('/reset-password', teacherController.resetPassword);
router.post('/verify-otp', teacherController.verifyOtp);

// Test and Results routes for students (must be before teacher-only middleware)
router.get('/student-tests', authenticateJWT, authorizeRoles('student', 'teacher', 'admin'), testController.getStudentTests);
router.post('/submit-test', authenticateJWT, authorizeRoles('student'), testController.submitTest);
router.get('/student-results', authenticateJWT, authorizeRoles('student', 'teacher', 'admin'), testController.getStudentResults);
router.get('/performance', authenticateJWT, authorizeRoles('student'), testController.getStudentPerformance);

// Protect all routes below (teacher/admin only)
router.use(authenticateJWT, authorizeRoles('teacher', 'admin'));

// Dashboard
router.get('/dashboard', teacherController.dashboard);
// Courses
router.get('/courses', teacherController.courses);
router.post('/courses', teacherController.courses);
// Messenger
router.get('/messenger', teacherController.messenger);
router.post('/messenger', teacherController.sendMessage);
// Profile
router.get('/profile', teacherController.profile);
// Resource upload
router.post('/upload-resource', upload.single('file'), teacherController.uploadResource);
// Add comment to course
router.post('/add-comment', teacherController.addComment);
// Update profile
router.put('/profile', teacherController.updateProfile);
// Update course
router.put('/courses/:id', teacherController.updateCourse);
// Edit message
router.put('/edit-message', authenticateJWT, authorizeRoles('teacher'), teacherController.editMessage);

// Test and Results routes for teachers
router.post('/create-test', testController.createTest);
router.post('/publish-test', testController.publishTest);
router.get('/tests', testController.getTeacherTests); // for teachers
router.post('/grade-submission', testController.gradeSubmission); // for teachers
router.get('/results', testController.getTeacherResults); // for teachers
router.get('/performance-summary', testController.getTeacherPerformanceSummary);

module.exports = router; 