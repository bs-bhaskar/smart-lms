function normalizeAnswer(value) {
  return String(value || '').trim().toLowerCase();
}

function calculateSubmissionMetrics(test, answers = []) {
  const answerMap = new Map(
    answers.map((a) => [String(a.questionId), a])
  );

  let totalMarks = 0;
  let maxMarks = 0;

  const gradedAnswers = test.questions.map((question) => {
    const submitted =
      answerMap.get(String(question._id)) || {
        questionId: question._id,
        answer: ''
      };

    const questionMax = Number(
      question.maxMarks ?? (question.type === 'mcq' ? 1 : 0)
    );

    maxMarks += questionMax;

    // MCQ → automatically grade
    if (question.type === 'mcq') {
      const correct =
        normalizeAnswer(submitted.answer) ===
        normalizeAnswer(question.correctAnswer);

      const marks = correct ? questionMax : 0;

      totalMarks += marks;

      return {
        ...submitted,
        marks
      };
    }

    // Theory → marks given by teacher
    const marks = Number(submitted.marks || 0);

    totalMarks += marks;

    return {
      ...submitted,
      marks,
      feedback: submitted.feedback
    };
  });

  const percentage =
    maxMarks > 0
      ? Number(((totalMarks / maxMarks) * 100).toFixed(2))
      : 0;

  return {
    gradedAnswers,
    totalMarks,
    maxMarks,
    percentage
  };
}

function summarizePerformance(submissions = []) {
  const testsTaken = submissions.length;

  if (testsTaken === 0) {
    return {
      testsTaken: 0,
      averagePercentage: 0,
      bestPercentage: 0,
      passRate: 0
    };
  }

  const percentages = submissions.map(
    (s) => Number(s.percentage || 0)
  );

  const averagePercentage = Number(
    (
      percentages.reduce((a, b) => a + b, 0) /
      testsTaken
    ).toFixed(2)
  );

  const bestPercentage = Math.max(...percentages);

  const passRate = Number(
    (
      (percentages.filter((p) => p >= 40).length /
        testsTaken) *
      100
    ).toFixed(2)
  );

  return {
    testsTaken,
    averagePercentage,
    bestPercentage,
    passRate
  };
}

module.exports = {
  calculateSubmissionMetrics,
  summarizePerformance
};