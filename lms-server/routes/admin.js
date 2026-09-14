const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const teacherController = require('../controllers/teacherController');
const Timetable = require('../models/Timetable');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// Public route for initial bootstrap only
router.post('/create-first-admin', adminController.createFirstAdmin);

// Protect all admin routes below
router.use(authenticateJWT, authorizeRoles('admin'));

// Teacher management
router.post('/create-teacher', adminController.createTeacher);
router.get('/teachers', adminController.listTeachers);
// Student management
router.get('/students', adminController.listStudents);
// Assign courses/timetables
router.post('/assign-course', adminController.assignCourse);
router.post('/assign-timetable', adminController.assignTimetable);
// Upload resources
router.post('/upload-resource', adminController.uploadResource);
// Monitor data
router.get('/monitor', adminController.monitor);
// Course management
router.post('/courses', adminController.createCourse);
router.get('/courses', adminController.listCourses);
// User CRUD
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
// Admin: View all test results
router.get('/results', teacherController.getAllResults);
router.get('/timetables', async (req, res) => {
  try {
    const timetables = await Timetable.find().populate('course', 'title').populate('teacher', 'name');
    res.json({ timetables });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
