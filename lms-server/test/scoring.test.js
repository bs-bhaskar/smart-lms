const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateSubmissionMetrics, summarizePerformance } = require('../utils/scoring');

test('calculateSubmissionMetrics grades MCQ and computes percentage', () => {
  const testDoc = {
    questions: [
      { _id: 'q1', type: 'mcq', correctAnswer: 'Paris', maxMarks: 2 },
      { _id: 'q2', type: 'mcq', correctAnswer: '4' },
    ],
  };

  const result = calculateSubmissionMetrics(testDoc, [
    { questionId: 'q1', answer: 'Paris' },
    { questionId: 'q2', answer: '5' },
  ]);

  assert.equal(result.totalMarks, 2);
  assert.equal(result.maxMarks, 3);
  assert.equal(result.percentage, 66.67);
});

test('summarizePerformance returns aggregate stats', () => {
  const summary = summarizePerformance([{ percentage: 50 }, { percentage: 80 }, { percentage: 20 }]);

  assert.equal(summary.testsTaken, 3);
  assert.equal(summary.averagePercentage, 50);
  assert.equal(summary.bestPercentage, 80);
  assert.equal(summary.passRate, 66.67);
});
