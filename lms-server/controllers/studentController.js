const User = require('../models/User');
const Course = require('../models/Course');
const Timetable = require('../models/Timetable');
const Message = require('../models/Message');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Submission = require('../models/Submission');

const { getStudyHelp } = require('../utils/aiTutor');
const { getJwtSecretOrThrow } = require('../utils/jwt');
const { sendOTP } = require('../utils/email');

/* ------------------ HELPERS ------------------ */
function generateRegistrationNumber() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/* ------------------ AUTH ------------------ */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const registrationNumber = generateRegistrationNumber();

    await User.create({
      name,
      email,
      password: hashed,
      registrationNumber,
      role: 'student',
      emailVerified: true,
    });

    res.status(201).json({
      message: 'Registration successful',
      registrationNumber,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { regNumber, password } = req.body;

    const user = await User.findOne({
      registrationNumber: regNumber,
      role: 'student',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
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
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ STUDY BOT ------------------ */
exports.studyBot = async (req, res) => {
  try {
    const { prompt, history = [] } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: 'Prompt is required'
      });
    }

    const studentId = req.user.id;

    const courses = await Course.find({
      students: studentId
    }).select('title');

    const timetables = await Timetable.find({
      students: studentId
    }).select('schedule');

    const context = {
      courses: courses.map(c => c.title),
      nextClass:
        timetables[0]?.schedule?.[0]?.day ||
        'your next class',
    };

    const result = await getStudyHelp({
      prompt,
      context,
      history,
    });

    res.json({
      source: result.source,
      prompt,
      answer: result.answer,
      context,
    });

  } catch (err) {
    console.error('Study bot error:', err);

    res.status(500).json({
      message: 'Server error'
    });
  }
};

/* ------------------ PROFILE ------------------ */
exports.profile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    res.json(student);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ MESSAGES ------------------ */
exports.messages = async (req, res) => {
  try {
    const messages = await Message.find({ recipients: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ messages });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
/* ------------------ DASHBOARD ------------------ */
exports.dashboard = async (req, res) => {
  try {
    const studentId = req.user.id;
    const courses = await Course.find({ students: studentId })
      .populate('teacher', 'name email');
    const resources = courses.flatMap(course =>
      (course.resources || []).map(r => ({
        ...r._doc,
        course: course.title,
        courseId: course._id
      }))
    );
    res.json({
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        description: c.description,
        teacher: c.teacher,
        resources: c.resources || [],
      })),
      resources,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ TIMETABLE ------------------ */
exports.timetable = async (req, res) => {
  try {
    const studentId = req.user.id;
    const timetables = await Timetable.find({ students: studentId })
      .populate('course', 'title')
      .populate('teacher', 'name');
    res.json({ timetables });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ PASSWORD ------------------ */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    const user = await User.findOne({
      email,
      role: 'student'
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    // Send OTP to student's email
    await sendOTP(email, otp);

    res.json({
      message: 'OTP sent successfully'
    });

  } catch (err) {
    console.error('Forgot password error:', err);

    res.status(500).json({
      message: 'Failed to send OTP'
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { regNumber, otp, newPassword } = req.body;
    const user = await User.findOne({ registrationNumber: regNumber, role: 'student' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, role: 'student' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    res.json({ message: 'OTP verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ COMMENTS ------------------ */
exports.addCourseComment = async (req, res) => {
  try {
    const { courseId, text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    course.comments.push({ user: req.user.id, text });
    await course.save();
    await course.populate('comments.user', 'name');
    res.json({
      comments: course.comments.map(c => ({
        user: c.user?.name || 'Unknown',
        text: c.text,
        createdAt: c.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCourseComments = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId).populate('comments.user', 'name');
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({
      comments: course.comments.map(c => ({
        user: c.user?.name || 'Unknown',
        text: c.text,
        createdAt: c.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ------------------ PARENT REPORT ------------------ */
exports.parentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await User.findOne({
      _id: studentId,
      role: 'student'
    }).select('name email registrationNumber');

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    const courses = await Course.find({
      students: studentId
    })
      .populate('teacher', 'name email')
      .select('title description teacher');

    const submissions = await Submission.find({
      student: studentId
    })
      .populate({
        path: 'test',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      })
      .sort({ submittedAt: -1 });

    // Only graded submissions are used for performance analytics
    const gradedSubmissions = submissions.filter(
      submission => submission.graded
    );

    const percentages = gradedSubmissions.map(
      submission => Number(submission.percentage || 0)
    );

    const testsTaken = gradedSubmissions.length;

    const averagePercentage =
      testsTaken > 0
        ? Number(
            (
              percentages.reduce((sum, value) => sum + value, 0) /
              testsTaken
            ).toFixed(2)
          )
        : 0;

    const highestPercentage =
      percentages.length > 0 ? Math.max(...percentages) : 0;

    const lowestPercentage =
      percentages.length > 0 ? Math.min(...percentages) : 0;

    const passRate =
      testsTaken > 0
        ? Number(
            (
              (percentages.filter(p => p >= 40).length / testsTaken) *
              100
            ).toFixed(2)
          )
        : 0;

    // Course-wise performance
    const courseMap = new Map();

    for (const submission of gradedSubmissions) {
      const course = submission.test?.course;

      if (!course) continue;

      const courseId = String(course._id);

      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          courseId,
          course: course.title,
          percentages: []
        });
      }

      courseMap.get(courseId).percentages.push(
        Number(submission.percentage || 0)
      );
    }

    const coursePerformance = Array.from(courseMap.values()).map(
      courseData => {
        const values = courseData.percentages;

        const averagePercentage =
          values.length > 0
            ? Number(
                (
                  values.reduce((sum, value) => sum + value, 0) /
                  values.length
                ).toFixed(2)
              )
            : 0;

        return {
          courseId: courseData.courseId,
          course: courseData.course,
          averagePercentage,
          tests: values.length
        };
      }
    );

    // Performance trend
    const trend = gradedSubmissions
      .slice()
      .reverse()
      .map(submission => ({
        test: submission.test?.title || 'Unknown Test',
        course: submission.test?.course?.title || 'Unknown Course',
        percentage: Number(submission.percentage || 0),
        date: submission.submittedAt
      }));

    res.json({
      student: {
        name: student.name,
        email: student.email,
        registrationNumber: student.registrationNumber
      },

      courses: courses.map(course => ({
        id: course._id,
        title: course.title,
        description: course.description,
        teacher: course.teacher
      })),

      performance: {
        averagePercentage,
        testsTaken,
        gradedTests: testsTaken,
        highestPercentage,
        lowestPercentage,
        passRate,
        coursePerformance,
        trend
      },

      results: submissions.map(submission => ({
        testTitle: submission.test?.title || 'Unknown Test',
        course: submission.test?.course?.title || 'Unknown Course',
        totalMarks: submission.totalMarks,
        maxMarks: submission.maxMarks,
        percentage: submission.percentage,
        graded: submission.graded,
        submittedAt: submission.submittedAt
      }))
    });

  } catch (err) {
    console.error('Parent report error:', err);

    res.status(500).json({
      message: 'Server error'
    });
  }
};