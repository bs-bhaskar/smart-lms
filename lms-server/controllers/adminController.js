const User = require('../models/User');
const Course = require('../models/Course');
const Timetable = require('../models/Timetable');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('../utils/email');

// Create first admin user (for initial setup)
exports.createFirstAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(403).json({ message: 'Bootstrap disabled: admin already exists' });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate admin registration number
    const registrationNumber = 'ADMIN' + Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashedPassword,
      registrationNumber,
      role: 'admin',
      emailVerified: true
    });

    res.status(201).json({
      message: 'Admin created successfully',
      registrationNumber,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        registrationNumber: admin.registrationNumber,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('CreateFirstAdmin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields required' });
    
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    
    // Generate 4-digit teacher registration number
    const registrationNumber = Math.floor(1000 + Math.random() * 9000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const teacher = await User.create({
      name,
      email,
      password: hashedPassword,
      registrationNumber,
      role: 'teacher',
      emailVerified: true
    });
    
    // Send welcome email with registration number
    try {
      const emailSubject = 'Welcome to Learning Management System - Teacher Account Created';
      const emailBody = `
        Dear ${name},
        
        Welcome to the Learning Management System!
        
        Your teacher account has been successfully created with the following details:
        
        Name: ${name}
        Email: ${email}
        Registration Number: ${registrationNumber}
        Role: Teacher

        For security, please use the 'Forgot Password' option on first login to set your personal password.
        We never send passwords by email.
        
        Best regards,
        LMS Administration Team
      `;
      
      await sendEmail(email, emailSubject, emailBody);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the request if email fails, just log it
    }
    
    res.status(201).json({ 
      message: 'Teacher created successfully', 
      registrationNumber,
      emailSent: true
    });
  } catch (err) {
    console.error('CreateTeacher error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'teacher' }).select('-password -otp -otpExpires');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password -otp -otpExpires');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignCourse = async (req, res) => {
  try {
    const { courseId, teacherId, studentIds } = req.body;
    console.log('AssignCourse request:', { courseId, teacherId, studentIds });
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    if (teacherId) {
      course.teacher = teacherId;
      console.log('Assigned teacher to course');
    }
    
    if (studentIds && studentIds.length > 0) {
      course.students = studentIds;
      console.log('Assigned students to course:', studentIds.length);
      
      // Always ensure a timetable exists for this course
      let timetable = await Timetable.findOne({ course: courseId });
      if (!timetable) {
        timetable = await Timetable.create({
          course: courseId,
          teacher: course.teacher,
          students: studentIds,
          schedule: []
        });
        course.timetable = timetable._id;
        await course.save();
        console.log('Created new timetable for course');
      } else {
        timetable.students = studentIds;
        timetable.teacher = course.teacher;
        await timetable.save();
        console.log('Updated timetable with students');
      }
    }
    
    await course.save();
    console.log('Course updated successfully');
    res.json({ message: 'Course assigned', course });
  } catch (err) {
    console.error('AssignCourse error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.assignTimetable = async (req, res) => {
  try {
    const { courseId, schedule } = req.body;
    console.log('AssignTimetable request:', { courseId, schedule });
    
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    console.log('Found course:', course.title);
    
    let timetable = await Timetable.findOne({ course: courseId });
    if (!timetable) {
      console.log('Creating new timetable');
      timetable = await Timetable.create({
        course: courseId,
        teacher: course.teacher,
        students: course.students,
        schedule
      });
      course.timetable = timetable._id;
      await course.save();
    } else {
      console.log('Updating existing timetable');
      timetable.schedule = schedule;
      timetable.teacher = course.teacher;
      timetable.students = course.students;
      await timetable.save();
      // Always link timetable to course
      course.timetable = timetable._id;
      await course.save();
    }
    console.log('Timetable saved:', timetable);
    res.json({ message: 'Timetable assigned', timetable });
  } catch (err) {
    console.error('AssignTimetable error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadResource = async (req, res) => {
  try {
    // For general platform resources, not course-specific
    // This can be extended as needed
    res.json({ message: 'Resource uploaded (not implemented)' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.monitor = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const courseCount = await Course.countDocuments();
    const timetableCount = await Timetable.countDocuments();
    res.json({ userCount, courseCount, timetableCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { title, description, teacherId } = req.body;
    console.log('CreateCourse request:', { title, description, teacherId });
    if (!title || !teacherId) return res.status(400).json({ message: 'Title and teacher are required' });
    const course = await Course.create({ title, description, teacher: teacherId });
    console.log('Course created:', course);
    res.status(201).json({ message: 'Course created', course });
  } catch (err) {
    console.error('CreateCourse error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listCourses = async (req, res) => {
  try {
    console.log('ListCourses request');
    const courses = await Course.find()
      .populate('teacher', 'name')
      .populate('students', 'name registrationNumber');
    console.log('Found courses:', courses.length);
    res.json({ courses });
  } catch (err) {
    console.error('ListCourses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 
