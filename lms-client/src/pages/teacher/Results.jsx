import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherResults() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(null); // submission being graded
  const [gradedAnswers, setGradedAnswers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const res = await api.get('/teacher/results', { headers: { Authorization: `Bearer ${token}` } });
        setSubmissions(res.data.submissions || []);
      } catch (err) {
        setError('Failed to load results');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [token, success]);

  // Start grading a submission
  const startGrading = (submission) => {
    setGrading(submission);
    setGradedAnswers(submission.answers.map(ans => ({
      questionId: ans.questionId,
      marks: ans.marks || '',
      feedback: ans.feedback || ''
    })));
    setError('');
    setSuccess('');
  };

  // Handle grading input
  const handleGradeChange = (idx, field, value) => {
    setGradedAnswers(ga => ga.map((a, i) => i === idx ? { ...a, [field]: value } : a));
  };

  // Submit grading
  const submitGrading = async () => {
    try {
      await api.post('/teacher/grade-submission', {
        submissionId: grading._id,
        gradedAnswers,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Submission graded!');
      setGrading(null);
    } catch (err) {
      setError('Failed to grade submission');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Test Results</h1>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
      {grading ? (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">Grading Submission</h2>
          <div className="mb-2 break-words">Student: {grading.student?.name}</div>
          <div className="mb-2 break-words">Test: {grading.test?.title}</div>
          <form onSubmit={e => { e.preventDefault(); submitGrading(); }}>
            {grading.answers.map((ans, i) => (
              <div key={ans.questionId} className="mb-4 p-3 sm:p-4 border rounded overflow-hidden">
                <div className="font-semibold break-words whitespace-pre-wrap">Q: {grading.test?.questions.find(q => String(q._id) === String(ans.questionId))?.text}</div>
                <div className="mb-2 break-words whitespace-pre-wrap">Student Answer: {ans.answer}</div>
                {grading.test?.questions.find(q => String(q._id) === String(ans.questionId))?.type === 'theory' && (
                  <>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="number" placeholder="Marks" value={gradedAnswers[i].marks} onChange={e => handleGradeChange(i, 'marks', e.target.value)} className="border rounded px-3 py-2 w-full sm:w-32" min={0} />
                    <input type="text" placeholder="Feedback" value={gradedAnswers[i].feedback} onChange={e => handleGradeChange(i, 'feedback', e.target.value)} className="border rounded px-3 py-2 w-full min-w-0" />
                  </div>
                  </>
                )}
                {grading.test?.questions.find(q => String(q._id) === String(ans.questionId))?.type === 'mcq' && (
                  <div className="text-green-700">Auto-graded: {ans.marks} mark(s)</div>
                )}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
            <button type="submit" className="bg-orange text-white px-4 py-2 rounded w-full sm:w-auto">Submit Grades</button>
            <button type="button" className="px-4 py-2 rounded bg-gray-300 w-full sm:w-auto" onClick={() => setGrading(null)}>Cancel</button>
            </div>
          </form>
        </div>
      ) : null}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">All Submissions</h2>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left border">
          <thead>
            <tr className="bg-orange/10">
              <th className="p-2 sm:p-3">Student</th>
              <th className="p-2 sm:p-3">Test</th>
              <th className="p-2 sm:p-3">Total Marks</th>
              <th className="p-2 sm:p-3">Graded</th>
              <th className="p-2 sm:p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.length ? submissions.map(sub => (
              <tr key={sub._id}>
                <td className="p-2 sm:p-3 break-words">{sub.student?.name}</td>
                <td className="p-2 sm:p-3">{sub.test?.title}</td>
                <td className="p-2 sm:p-3">{sub.totalMarks ?? '-'}</td>
                <td className="p-2 sm:p-3">{sub.graded ? 'Yes' : 'No'}</td>
                <td className="p-2 sm:p-3">
                  <div className="flex flex-col sm:flex-row gap-2">

                    {!sub.graded && (
                      <button
                        className="bg-orange text-white px-3 py-2 rounded whitespace-nowrap"
                        onClick={() => startGrading(sub)}
                      >
                        Grade
                      </button>
                    )}

                    {sub.graded && (
                      <button
                        className="bg-blue-600 text-white px-3 py-2 rounded whitespace-nowrap"
                        onClick={() => startGrading(sub)}
                      >
                        Re-Grade
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={5} className="p-2 text-center">No submissions found.</td></tr>}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
} 