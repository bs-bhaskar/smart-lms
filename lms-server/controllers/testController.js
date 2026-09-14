const Test = require('../models/Test');
const Submission = require('../models/Submission');
const Course = require('../models/Course');
const { calculateSubmissionMetrics, summarizePerformance } = require('../utils/scoring');

exports.createTest = async (req, res) => {
  try {
    const { title, description, course, questions, duration, expiry } = req.body;
    const test = await Test.create({
      title,
      description,
      course,
      questions,
      duration,
      createdBy: req.user.id,
      expiry: expiry ? new Date(expiry) : undefined,
    });
    res.status(201).json({ message: 'Test created', test });
  } catch (err) {
    console.error('Create test error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

async function removeExpiredTests() {
  const now = new Date();
  await Test.deleteMany({ expiry: { $lte: now } });
}

exports.publishTest = async (req, res) => {
  try {
    const { testId, published } = req.body;
    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });
    test.published = published;
    await test.save();
    res.json({ message: 'Test updated', test });
  } catch (err) {
    console.error('Publish test error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeacherTests = async (req, res) => {
  try {
    await removeExpiredTests();
    const courses = await Course.find({ teacher: req.user.id }).select('_id');
    const tests = await Test.find({ course: { $in: courses.map((c) => c._id) } });
    res.json({ tests });
  } catch (err) {
    console.error('Get teacher tests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentTests = async (req, res) => {
  try {
    await removeExpiredTests();
    const courses = await Course.find({ students: req.user.id }).select('_id');
    const tests = await Test.find({ course: { $in: courses.map((c) => c._id) }, published: true });
    res.json({ tests });
  } catch (err) {
    console.error('Get student tests error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { testId, answers = [] } = req.body;
    const studentId = req.user.id;

    const existing = await Submission.findOne({ test: testId, student: studentId });
    if (existing) return res.status(400).json({ message: 'Already submitted' });

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ message: 'Test not found' });

    const metrics = calculateSubmissionMetrics(test, answers);

    const submission = await Submission.create({
      test: testId,
      student: studentId,
      answers: metrics.gradedAnswers,
      totalMarks: metrics.totalMarks,
      maxMarks: metrics.maxMarks,
      percentage: metrics.percentage,
      graded: false,
    });

    res.status(201).json({ message: 'Test submitted', submission });
  } catch (err) {
    console.error('Submit test error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const { submissionId, gradedAnswers = [] } = req.body;
    const submission = await Submission.findById(submissionId).populate('test');
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.answers = submission.answers.map((ans) => {
      const graded = gradedAnswers.find((g) => String(g.questionId) === String(ans.questionId));
      if (graded) {
        ans.marks = graded.marks;
        ans.feedback = graded.feedback;
      }
      return ans;
    });

    const metrics = calculateSubmissionMetrics(submission.test, submission.answers);
    submission.totalMarks = metrics.totalMarks;
    submission.maxMarks = metrics.maxMarks;
    submission.percentage = metrics.percentage;
    submission.graded = true;
    await submission.save();

    res.json({ message: 'Submission graded', submission });
  } catch (err) {
    console.error('Grade submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getStudentResults = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id }).populate('test');
    res.json({ submissions, summary: summarizePerformance(submissions) });
  } catch (err) {
    console.error('Get student results error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTeacherResults = async (req, res) => {
  try {
    const courses = await Course.find({
      teacher: req.user.id
    }).select('_id');

    const courseIds = courses.map((c) => c._id);

    const tests = await Test.find({
      course: { $in: courseIds }
    }).select('_id');

    const testIds = tests.map((t) => t._id);

    const submissions = await Submission.find({
      test: { $in: testIds }
    })
      .populate('student', 'name registrationNumber')
      .populate(
        'test',
        'title description questions duration course'
      );

    res.json({
      submissions,
      summary: summarizePerformance(submissions)
    });

  } catch (err) {
    console.error('Get teacher results error:', err);
    res.status(500).json({
      message: 'Server error'
    });
  }
};

exports.getAllResults = async (req, res) => {
  try {
    const submissions = await Submission.find().populate('student', 'name registrationNumber').populate('test', 'title');
    res.json({ submissions, summary: summarizePerformance(submissions) });
  } catch (err) {
    console.error('Get all results error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentPerformance = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Only graded submissions are used for academic performance
    const submissions = await Submission.find({
      student: studentId,
      graded: true
    })
      .populate({
        path: 'test',
        select: 'title course',
        populate: {
          path: 'course',
          select: 'title'
        }
      })
      .sort({ submittedAt: 1 });

    // Basic summary
    const summary = summarizePerformance(submissions);

    const percentages = submissions.map((submission) =>
      Number(submission.percentage || 0)
    );

    const lowestPercentage =
      percentages.length > 0 ? Math.min(...percentages) : 0;

    // Course-wise performance
    const courseMap = new Map();

    for (const submission of submissions) {
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
      (courseData) => {
        const percentages = courseData.percentages;

        const averagePercentage =
          percentages.length > 0
            ? Number(
                (
                  percentages.reduce((sum, value) => sum + value, 0) /
                  percentages.length
                ).toFixed(2)
              )
            : 0;

        return {
          courseId: courseData.courseId,
          course: courseData.course,
          averagePercentage,
          tests: percentages.length
        };
      }
    );

    // Performance trend
    const trend = submissions.map((submission) => ({
      test: submission.test?.title || 'Unknown Test',
      course: submission.test?.course?.title || 'Unknown Course',
      percentage: Number(submission.percentage || 0),
      date: submission.submittedAt
    }));

    res.json({
      summary: {
        ...summary,
        lowestPercentage,
        gradedTests: submissions.length
      },
      coursePerformance,
      trend
    });

  } catch (err) {
    console.error('Get student performance error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getTeacherPerformanceSummary = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user.id }).select('_id');
    const tests = await Test.find({ course: { $in: courses.map((c) => c._id) } }).select('_id');
    const submissions = await Submission.find({ test: { $in: tests.map((t) => t._id) } })
      .populate('student', 'name registrationNumber');

    const byStudent = new Map();
    for (const submission of submissions) {
      const key = String(submission.student?._id || 'unknown');
      if (!byStudent.has(key)) {
        byStudent.set(key, {
          studentId: key,
          name: submission.student?.name || 'Unknown',
          registrationNumber: submission.student?.registrationNumber || 'N/A',
          submissions: [],
        });
      }
      byStudent.get(key).submissions.push(submission);
    }

    const students = Array.from(byStudent.values()).map((entry) => ({
      studentId: entry.studentId,
      name: entry.name,
      registrationNumber: entry.registrationNumber,
      ...summarizePerformance(entry.submissions),
    }));

    res.json({ overall: summarizePerformance(submissions), students });
  } catch (err) {
    console.error('Get teacher performance summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
