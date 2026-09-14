// import React, { useEffect, useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';

// export default function TeacherTests() {
//   const { token } = useAuth();
//   const [tests, setTests] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState({ title: '', description: '', course: '', duration: '', questions: [] });
//   const [question, setQuestion] = useState({ type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: '', maxMarks: '', modelAnswer: '' });
//   const [creating, setCreating] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   // Fetch teacher's courses and tests
//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       try {
//         const [coursesRes, testsRes] = await Promise.all([
//           api.get('/teacher/courses', { headers: { Authorization: `Bearer ${token}` } }),
//           api.get('/teacher/tests', { headers: { Authorization: `Bearer ${token}` } })
//         ]);
//         setCourses(coursesRes.data.courses || []);
//         setTests(testsRes.data.tests || []);
//       } catch (err) {
//         setError('Failed to load tests or courses');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [token, success]);

//   // Handle test form changes
//   const handleFormChange = e => {
//     setForm(f => ({ ...f, [e.target.name]: e.target.value }));
//     setError('');
//     setSuccess('');
//   };

//   // Handle question form changes
//   const handleQuestionChange = e => {
//     const { name, value } = e.target;
//     if (name.startsWith('option')) {
//       const idx = parseInt(name.replace('option', ''));
//       setQuestion(q => {
//         const opts = [...q.options];
//         opts[idx] = value;
//         return { ...q, options: opts };
//       });
//     } else {
//       setQuestion(q => ({ ...q, [name]: value }));
//     }
//   };

//   // Add question to test
//   const addQuestion = () => {
//     if (!question.text.trim()) return;
//     if (question.type === 'mcq' && (!question.options.some(opt => opt.trim()) || !question.correctAnswer.trim())) {
//       setError('MCQ must have options and a correct answer');
//       return;
//     }
//     if (question.type === 'theory' && (!question.text.trim() || !question.maxMarks)) {
//       setError('Theory question must have text and max marks');
//       return;
//     }
//     setForm(f => ({ ...f, questions: [...f.questions, question] }));
//     setQuestion({ type: 'mcq', text: '', options: ['', '', '', ''], correctAnswer: '', maxMarks: '', modelAnswer: '' });
//     setError('');
//   };

//   // Remove question
//   const removeQuestion = idx => {
//     setForm(f => ({ ...f, questions: f.questions.filter((_, i) => i !== idx) }));
//   };

//   // Create test
//   const handleCreateTest = async e => {
//     e.preventDefault();
//     setCreating(true);
//     setError('');
//     setSuccess('');
//     try {
//       await api.post('/teacher/create-test', {
//         ...form,
//         duration: Number(form.duration),
//       }, { headers: { Authorization: `Bearer ${token}` } });
//       setSuccess('Test created!');
//       setForm({ title: '', description: '', course: '', duration: '', questions: [] });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create test');
//     } finally {
//       setCreating(false);
//     }
//   };

//   // Publish/unpublish test
//   const handlePublish = async (testId, published) => {
//     try {
//       await api.post('/teacher/publish-test', { testId, published }, { headers: { Authorization: `Bearer ${token}` } });
//       setSuccess('Test updated');
//     } catch (err) {
//       setError('Failed to update test');
//     }
//   };

//   if (loading) return <Loader />;

//   return (
//     <div className="max-w-4xl mx-auto mt-8">
//       <h1 className="text-2xl font-bold text-orange mb-6">Tests</h1>
//       <div className="bg-white rounded-xl shadow p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4 text-orange">Create New Test</h2>
//         <form onSubmit={handleCreateTest} className="grid gap-4 md:grid-cols-2">
//           <div>
//             <label className="block mb-1 font-medium">Title</label>
//             <input type="text" name="title" value={form.title} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Course</label>
//             <select name="course" value={form.course} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required>
//               <option value="">Select course</option>
//               {courses.map(c => <option key={c.id || c._id} value={c.id || c._id}>{c.title}</option>)}
//             </select>
//           </div>
//           <div className="md:col-span-2">
//             <label className="block mb-1 font-medium">Description</label>
//             <textarea name="description" value={form.description} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Duration (minutes)</label>
//             <input type="number" name="duration" value={form.duration} onChange={handleFormChange} className="w-full border rounded px-3 py-2" required min={1} />
//           </div>
//         </form>
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Add Question</h3>
//           <div className="flex gap-4 mb-2">
//             <select name="type" value={question.type} onChange={handleQuestionChange} className="border rounded px-2 py-1">
//               <option value="mcq">MCQ</option>
//               <option value="theory">Theory</option>
//             </select>
//             <input type="text" name="text" value={question.text} onChange={handleQuestionChange} className="border rounded px-2 py-1 flex-1" placeholder="Question text" />
//           </div>
//           {question.type === 'mcq' && (
//             <div className="grid grid-cols-2 gap-2 mb-2">
//               {[0, 1, 2, 3].map(i => (
//                 <input key={i} type="text" name={`option${i}`} value={question.options[i]} onChange={handleQuestionChange} className="border rounded px-2 py-1" placeholder={`Option ${i + 1}`} />
//               ))}
//               <input type="text" name="correctAnswer" value={question.correctAnswer} onChange={handleQuestionChange} className="border rounded px-2 py-1 col-span-2" placeholder="Correct answer (must match one option)" />
//             </div>
//           )}
//           {question.type === 'theory' && (
//             <div className="grid grid-cols-2 gap-2 mb-2">
//               <input type="number" name="maxMarks" value={question.maxMarks} onChange={handleQuestionChange} className="border rounded px-2 py-1" placeholder="Max marks" min={1} />
//               <input type="text" name="modelAnswer" value={question.modelAnswer} onChange={handleQuestionChange} className="border rounded px-2 py-1" placeholder="Model answer (optional)" />
//             </div>
//           )}
//           <button type="button" className="bg-orange text-white px-4 py-1 rounded" onClick={addQuestion}>Add Question</button>
//         </div>
//         <div className="mt-4">
//           <h3 className="font-semibold mb-2">Questions</h3>
//           <ul className="list-decimal ml-6">
//             {form.questions.map((q, i) => (
//               <li key={i} className="mb-2">
//                 <span className="font-semibold">[{q.type.toUpperCase()}]</span> {q.text}
//                 {q.type === 'mcq' && (
//                   <span> (Options: {q.options.filter(Boolean).join(', ')}, Correct: {q.correctAnswer})</span>
//                 )}
//                 {q.type === 'theory' && (
//                   <span> (Max marks: {q.maxMarks})</span>
//                 )}
//                 <button className="ml-2 text-red-600" onClick={() => removeQuestion(i)}>Remove</button>
//               </li>
//             ))}
//           </ul>
//         </div>
//         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
//         {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
//         <button onClick={handleCreateTest} className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition mt-4" disabled={creating}>Create Test</button>
//       </div>
//       <div className="bg-white rounded-xl shadow p-6">
//         <h2 className="text-xl font-semibold mb-4 text-orange">All Tests</h2>
//         <ul className="divide-y">
//           {tests.length ? tests.map(test => (
//             <li key={test._id} className="py-4">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <div className="font-semibold text-lg">{test.title}</div>
//                   <div className="text-gray-600 text-sm">{test.description}</div>
//                   <div className="text-gray-500 text-xs">Course: {courses.find(c => (c.id || c._id) === (test.course?._id || test.course))?.title || test.course?.title || test.course}</div>
//                   <div className="text-gray-500 text-xs">Duration: {test.duration} min</div>
//                   <div className="text-gray-500 text-xs">Questions: {test.questions.length}</div>
//                 </div>
//                 <div>
//                   <button className={`px-3 py-1 rounded text-white ${test.published ? 'bg-green-600' : 'bg-gray-400'}`} onClick={() => handlePublish(test._id, !test.published)}>
//                     {test.published ? 'Published' : 'Unpublished'}
//                   </button>
//                 </div>
//               </div>
//             </li>
//           )) : <li>No tests found.</li>}
//         </ul>
//       </div>
//     </div>
//   );
// } 
///////////////////////////----------RESPONSIVE DESIGN-----------------///////////////////////////
import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherTests() {
  const { token } = useAuth();
  const [tests, setTests] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    course: '',
    duration: '',
    questions: []
  });
  const [question, setQuestion] = useState({
    type: 'mcq',
    text: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    maxMarks: '',
    modelAnswer: ''
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch teacher's courses and tests
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [coursesRes, testsRes] = await Promise.all([
          api.get('/teacher/courses', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/teacher/tests', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCourses(coursesRes.data.courses || []);
        setTests(testsRes.data.tests || []);
      } catch (err) {
        setError('Failed to load tests or courses');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token, success]);

  // Handle test form changes
  const handleFormChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  // Handle question form changes
  const handleQuestionChange = e => {
    const { name, value } = e.target;

    if (name.startsWith('option')) {
      const idx = parseInt(name.replace('option', ''));

      setQuestion(q => {
        const opts = [...q.options];
        opts[idx] = value;
        return { ...q, options: opts };
      });
    } else {
      setQuestion(q => ({ ...q, [name]: value }));
    }
  };

  // Add question to test
  const addQuestion = () => {
    if (!question.text.trim()) return;

    if (
      question.type === 'mcq' &&
      (!question.options.some(opt => opt.trim()) ||
        !question.correctAnswer.trim())
    ) {
      setError('MCQ must have options and a correct answer');
      return;
    }

    if (
      question.type === 'theory' &&
      (!question.text.trim() || !question.maxMarks)
    ) {
      setError('Theory question must have text and max marks');
      return;
    }

    setForm(f => ({
      ...f,
      questions: [...f.questions, question]
    }));

    setQuestion({
      type: 'mcq',
      text: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      maxMarks: '',
      modelAnswer: ''
    });

    setError('');
  };

  // Remove question
  const removeQuestion = idx => {
    setForm(f => ({
      ...f,
      questions: f.questions.filter((_, i) => i !== idx)
    }));
  };

  // Create test
  const handleCreateTest = async e => {
    e.preventDefault();

    setCreating(true);
    setError('');
    setSuccess('');

    try {
      await api.post(
        '/teacher/create-test',
        {
          ...form,
          duration: Number(form.duration)
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Test created!');

      setForm({
        title: '',
        description: '',
        course: '',
        duration: '',
        questions: []
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create test');
    } finally {
      setCreating(false);
    }
  };

  // Publish/unpublish test
  const handlePublish = async (testId, published) => {
    try {
      await api.post(
        '/teacher/publish-test',
        { testId, published },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Test updated');
    } catch (err) {
      setError('Failed to update test');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">

      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
        Tests
      </h1>

      {/* Create Test */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">
          Create New Test
        </h2>

        <form
          onSubmit={handleCreateTest}
          className="grid gap-4 md:grid-cols-2"
        >
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleFormChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Course</label>
            <select
              name="course"
              value={form.course}
              onChange={handleFormChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            >
              <option value="">Select course</option>

              {courses.map(c => (
                <option
                  key={c.id || c._id}
                  value={c.id || c._id}
                >
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleFormChange}
              className="w-full min-w-0 border rounded px-3 py-2 resize-y"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Duration (minutes)
            </label>

            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleFormChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
              min={1}
            />
          </div>
        </form>

        {/* Add Question */}
        <div className="mt-5 sm:mt-6">
          <h3 className="font-semibold mb-2">
            Add Question
          </h3>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
            <select
              name="type"
              value={question.type}
              onChange={handleQuestionChange}
              className="border rounded px-2 py-2 w-full sm:w-auto"
            >
              <option value="mcq">MCQ</option>
              <option value="theory">Theory</option>
            </select>

            <input
              type="text"
              name="text"
              value={question.text}
              onChange={handleQuestionChange}
              className="border rounded px-2 py-2 flex-1 min-w-0"
              placeholder="Question text"
            />
          </div>

          {/* MCQ */}
          {question.type === 'mcq' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              {[0, 1, 2, 3].map(i => (
                <input
                  key={i}
                  type="text"
                  name={`option${i}`}
                  value={question.options[i]}
                  onChange={handleQuestionChange}
                  className="border rounded px-2 py-2 w-full min-w-0"
                  placeholder={`Option ${i + 1}`}
                />
              ))}

              <input
                type="text"
                name="correctAnswer"
                value={question.correctAnswer}
                onChange={handleQuestionChange}
                className="border rounded px-2 py-2 w-full min-w-0 sm:col-span-2"
                placeholder="Correct answer (must match one option)"
              />
            </div>
          )}

          {/* Theory */}
          {question.type === 'theory' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                name="maxMarks"
                value={question.maxMarks}
                onChange={handleQuestionChange}
                className="border rounded px-2 py-2 w-full min-w-0"
                placeholder="Max marks"
                min={1}
              />

              <input
                type="text"
                name="modelAnswer"
                value={question.modelAnswer}
                onChange={handleQuestionChange}
                className="border rounded px-2 py-2 w-full min-w-0"
                placeholder="Model answer (optional)"
              />
            </div>
          )}

          <button
            type="button"
            className="bg-orange text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={addQuestion}
          >
            Add Question
          </button>
        </div>

        {/* Questions */}
        <div className="mt-5 sm:mt-6">
          <h3 className="font-semibold mb-2">
            Questions
          </h3>

          <ul className="list-decimal ml-5 sm:ml-6">
            {form.questions.map((q, i) => (
              <li
                key={i}
                className="mb-2 break-words overflow-hidden"
              >
                <span className="font-semibold">
                  [{q.type.toUpperCase()}]
                </span>{' '}

                <span>{q.text}</span>

                {q.type === 'mcq' && (
                  <span className="break-words">
                    {' '}
                    (Options: {q.options.filter(Boolean).join(', ')},
                    Correct: {q.correctAnswer})
                  </span>
                )}

                {q.type === 'theory' && (
                  <span>
                    {' '}
                    (Max marks: {q.maxMarks})
                  </span>
                )}

                <button
                  className="ml-2 text-red-600 whitespace-nowrap"
                  onClick={() => removeQuestion(i)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {error && (
          <div className="text-red-600 text-sm mb-3 break-words">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm mb-3 break-words">
            {success}
          </div>
        )}

        <button
          onClick={handleCreateTest}
          className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition mt-4 w-full sm:w-auto"
          disabled={creating}
        >
          {creating ? 'Creating...' : 'Create Test'}
        </button>
      </div>

      {/* All Tests */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">
          All Tests
        </h2>

        <ul className="divide-y">
          {tests.length ? (
            tests.map(test => (
              <li
                key={test._id}
                className="py-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">

                  <div className="min-w-0 flex-1 break-words">
                    <div className="font-semibold text-base sm:text-lg break-words">
                      {test.title}
                    </div>

                    <div className="text-gray-600 text-sm break-words whitespace-pre-wrap">
                      {test.description}
                    </div>

                    <div className="text-gray-500 text-xs break-words">
                      Course:{' '}
                      {courses.find(
                        c =>
                          (c.id || c._id) ===
                          (test.course?._id || test.course)
                      )?.title ||
                        test.course?.title ||
                        test.course}
                    </div>

                    <div className="text-gray-500 text-xs">
                      Duration: {test.duration} min
                    </div>

                    <div className="text-gray-500 text-xs">
                      Questions: {test.questions.length}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    <button
                      className={`px-3 py-2 rounded text-white w-full sm:w-auto whitespace-nowrap ${
                        test.published
                          ? 'bg-green-600'
                          : 'bg-gray-400'
                      }`}
                      onClick={() =>
                        handlePublish(
                          test._id,
                          !test.published
                        )
                      }
                    >
                      {test.published
                        ? 'Published'
                        : 'Unpublished'}
                    </button>
                  </div>

                </div>
              </li>
            ))
          ) : (
            <li>No tests found.</li>
          )}
        </ul>
      </div>
    </div>
  );
}