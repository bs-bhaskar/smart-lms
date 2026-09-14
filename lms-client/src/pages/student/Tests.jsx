import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentTests() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taking, setTaking] = useState(null); // test being taken
  const [answers, setAnswers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchTests() {
      setLoading(true);
      try {
        const res = await api.get('/teacher/student-tests', { headers: { Authorization: `Bearer ${token}` } });
        setTests(res.data.tests || []);
      } catch (err) {
        setError('Failed to load tests');
      } finally {
        setLoading(false);
      }
    }
    fetchTests();
  }, [token, success]);

  // Start taking a test
  const startTest = (test) => {
    setTaking(test);
    setAnswers(test.questions.map(q => ({ questionId: q._id, answer: '' })));
    setError('');
    setSuccess('');
  };

  // Handle answer change
  const handleAnswerChange = (idx, value) => {
    setAnswers(a => a.map((ans, i) => i === idx ? { ...ans, answer: value } : ans));
  };

  // Submit test
  const submitTest = async () => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/teacher/submit-test', {
        testId: taking._id,
        answers,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Test submitted!');
      setTaking(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Available Tests</h1>
      {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
      {taking ? (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange break-words">{taking.title}</h2>
          <div className="mb-2 text-gray-600">{taking.description}</div>
          <div className="mb-2 text-gray-500 text-sm">Duration: {taking.duration} min</div>
          <form onSubmit={e => { e.preventDefault(); submitTest(); }}>
            {taking.questions.map((q, i) => (
              <div key={q._id} className="mb-4 p-3 sm:p-4 border rounded break-words overflow-hidden">
                <div className="font-semibold break-words">Q{i + 1}: {q.text}</div>
                {q.type === 'mcq' ? (
                  <div className="mt-2">
                    {q.options.map((opt, j) => (
                      <label key={j} className="block py-1 break-words">
                        <input
                          type="radio"
                          name={`q${i}`}
                          value={opt}
                          checked={answers[i].answer === opt}
                          onChange={e => handleAnswerChange(i, opt)}
                          className="mr-2"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={answers[i].answer}
                    onChange={e => handleAnswerChange(i, e.target.value)}
                    className="w-full min-w-0 border rounded px-3 py-2 mt-2 resize-y"
                    placeholder="Your answer"
                    rows={3}
                  />
                )}
              </div>
            ))}
            <div className="flex flex-col sm:flex-row gap-2 mt-3">
              <button
                type="submit"
                className="bg-orange text-white px-4 py-2 rounded w-full sm:w-auto"
                disabled={submitting}
              >
                Submit Test
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-300 w-full sm:w-auto"
                onClick={() => setTaking(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">All Tests</h2>
        <ul className="divide-y">
          {tests.length ? tests.map(test => (
            <li key={test._id} className="py-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <div className="font-semibold text-base sm:text-lg break-words">{test.title}</div>
                  <div className="text-gray-600 text-sm break-words">{test.description}</div>
                  <div className="text-gray-500 text-xs">Duration: {test.duration} min</div>
                  <div className="text-gray-500 text-xs">Questions: {test.questions.length}</div>
                </div>
                <div className="w-full sm:w-auto">
                  <button className="bg-orange text-white px-3 py-2 rounded w-full sm:w-auto" onClick={() => startTest(test)}>Take Test</button>
                </div>
              </div>
            </li>
          )) : <li>No tests found.</li>}
        </ul>
      </div>
    </div>
  );
} 