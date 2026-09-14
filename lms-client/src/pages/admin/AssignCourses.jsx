// import React, { useEffect, useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';

// export default function AssignCourses() {
//   const { token } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [form, setForm] = useState({ courseId: '', teacherId: '', studentIds: [] });
//   const [regNumbers, setRegNumbers] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   // For resource upload and comments
//   const [detailedCourses, setDetailedCourses] = useState([]);
//   const [fetchingDetails, setFetchingDetails] = useState(false);
//   const [uploading, setUploading] = useState({});
//   const [uploadError, setUploadError] = useState({});
//   const [uploadSuccess, setUploadSuccess] = useState({});
//   const [fileInputs, setFileInputs] = useState({});
//   const [linkInputs, setLinkInputs] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});
//   const [commentLoading, setCommentLoading] = useState({});
//   const [commentError, setCommentError] = useState({});

//   useEffect(() => {
//     async function fetchData() {
//       setLoading(true);
//       setError('');
//       try {
//         const [coursesRes, teachersRes, studentsRes] = await Promise.all([
//           api.get('/admin/courses', { headers: { Authorization: `Bearer ${token}` } }),
//           api.get('/admin/teachers', { headers: { Authorization: `Bearer ${token}` } }),
//           api.get('/admin/students', { headers: { Authorization: `Bearer ${token}` } })
//         ]);
//         setCourses(Array.isArray(coursesRes.data.courses) ? coursesRes.data.courses : []);
//         setTeachers(Array.isArray(teachersRes.data) ? teachersRes.data : []);
//         setStudents(Array.isArray(studentsRes.data) ? studentsRes.data : []);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, [token]);

//   // Fetch detailed course info (resources/comments)
//   const fetchDetailedCourses = async () => {
//     setFetchingDetails(true);
//     try {
//       const res = await api.get('/teacher/courses', { headers: { Authorization: `Bearer ${token}` } });
//       setDetailedCourses(res.data.courses || []);
//     } catch {
//       setDetailedCourses([]);
//     } finally {
//       setFetchingDetails(false);
//     }
//   };
//   useEffect(() => { fetchDetailedCourses(); /* eslint-disable-next-line */ }, [token, success]);

//   // File upload handler
//   const handleFileChange = (courseId, file) => {
//     setFileInputs(f => ({ ...f, [courseId]: file }));
//     setUploadError(e => ({ ...e, [courseId]: '' }));
//     setUploadSuccess(s => ({ ...s, [courseId]: '' }));
//   };
//   const handleFileUpload = async (courseId) => {
//     if (!fileInputs[courseId]) return;
//     setUploading(u => ({ ...u, [courseId]: true }));
//     setUploadError(e => ({ ...e, [courseId]: '' }));
//     setUploadSuccess(s => ({ ...s, [courseId]: '' }));
//     try {
//       const formData = new FormData();
//       formData.append('file', fileInputs[courseId]);
//       formData.append('courseId', courseId);
//       await api.post('/teacher/upload-resource', formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUploadSuccess(s => ({ ...s, [courseId]: 'File uploaded!' }));
//       setFileInputs(f => ({ ...f, [courseId]: null }));
//       fetchDetailedCourses();
//     } catch (err) {
//       setUploadError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Upload failed' }));
//     } finally {
//       setUploading(u => ({ ...u, [courseId]: false }));
//     }
//   };
//   // Link upload handler (as a resource entry)
//   const handleLinkChange = (courseId, value) => {
//     setLinkInputs(l => ({ ...l, [courseId]: value }));
//     setUploadError(e => ({ ...e, [courseId]: '' }));
//     setUploadSuccess(s => ({ ...s, [courseId]: '' }));
//   };
//   const handleLinkUpload = async (courseId) => {
//     if (!linkInputs[courseId]) return;
//     setUploading(u => ({ ...u, [courseId]: true }));
//     setUploadError(e => ({ ...e, [courseId]: '' }));
//     setUploadSuccess(s => ({ ...s, [courseId]: '' }));
//     try {
//       await api.put(`/teacher/courses/${courseId}`, { courseId, link: linkInputs[courseId] }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUploadSuccess(s => ({ ...s, [courseId]: 'Link added!' }));
//       setLinkInputs(l => ({ ...l, [courseId]: '' }));
//       fetchDetailedCourses();
//     } catch (err) {
//       setUploadError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Failed to add link' }));
//     } finally {
//       setUploading(u => ({ ...u, [courseId]: false }));
//     }
//   };
//   // Comment handler
//   const handleCommentChange = (courseId, value) => {
//     setCommentInputs(c => ({ ...c, [courseId]: value }));
//     setCommentError(e => ({ ...e, [courseId]: '' }));
//   };
//   const handleCommentSubmit = async (courseId) => {
//     if (!commentInputs[courseId]) return;
//     setCommentLoading(l => ({ ...l, [courseId]: true }));
//     setCommentError(e => ({ ...e, [courseId]: '' }));
//     try {
//       await api.post('/teacher/add-comment', { courseId, text: commentInputs[courseId] }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCommentInputs(c => ({ ...c, [courseId]: '' }));
//       fetchDetailedCourses();
//     } catch (err) {
//       setCommentError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Failed to add comment' }));
//     } finally {
//       setCommentLoading(l => ({ ...l, [courseId]: false }));
//     }
//   };

//   const handleChange = e => {
//     const { name, value, options } = e.target;
//     if (name === 'studentIds') {
//       const selected = Array.from(options).filter(o => o.selected).map(o => o.value);
//       setForm(f => ({ ...f, studentIds: selected }));
//     } else {
//       setForm(f => ({ ...f, [name]: value }));
//     }
//     setSuccess('');
//     setError('');
//   };

//   const handleRegNumbersChange = e => {
//     setRegNumbers(e.target.value);
//     setSuccess('');
//     setError('');
//   };

//   // Select all students function
//   const handleSelectAllStudents = () => {
//     const allStudentIds = students.map(s => s._id);
//     setForm(f => ({ ...f, studentIds: allStudentIds }));
//     setSuccess('');
//     setError('');
//   };

//   // Clear all students function
//   const handleClearAllStudents = () => {
//     setForm(f => ({ ...f, studentIds: [] }));
//     setSuccess('');
//     setError('');
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setAssigning(true);
//     setError('');
//     setSuccess('');
//     let studentIds = form.studentIds;
//     // If registration numbers are provided, look up student IDs
//     if (regNumbers.trim()) {
//       const regNums = regNumbers.split(/[,\n]+/).map(s => s.trim()).filter(Boolean);
//       try {
//         const res = await api.get('/admin/students', { headers: { Authorization: `Bearer ${token}` } });
//         const allStudents = res.data || [];
//         const found = allStudents.filter(s => regNums.includes(s.registrationNumber));
//         if (found.length !== regNums.length) {
//           const missing = regNums.filter(rn => !found.some(s => s.registrationNumber === rn));
//           setError('Invalid registration numbers: ' + missing.join(', '));
//           setAssigning(false);
//           return;
//         }
//         studentIds = found.map(s => s._id);
//       } catch (err) {
//         setError('Failed to look up registration numbers');
//         setAssigning(false);
//         return;
//       }
//     }
//     try {
//       await api.post('/admin/assign-course', {
//         ...form,
//         studentIds,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess('Course assigned successfully!');
//       setRegNumbers('');
//       setForm(f => ({ ...f, studentIds: [] }));
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to assign course');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
//       <h1 className="text-2xl font-bold text-orange mb-6">Assign Courses</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Course</label>
//           <select name="courseId" value={form.courseId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
//             <option value="">Select a course</option>
//             {Array.isArray(courses) && courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Teacher</label>
//           <select name="teacherId" value={form.teacherId} onChange={handleChange} className="w-full border rounded px-3 py-2">
//             <option value="">Select a teacher</option>
//             {Array.isArray(teachers) && teachers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
//           </select>
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Assign Students (by Registration Number)</label>
//           <textarea
//             value={regNumbers}
//             onChange={handleRegNumbersChange}
//             className="w-full border rounded px-3 py-2"
//             placeholder="Enter registration numbers, separated by comma or newline"
//             rows={2}
//           />
//           <div className="text-xs text-gray-500 mt-1">Or select students below:</div>
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Or Select Students</label>
//           <div className="flex gap-2 mb-2">
//             <button
//               type="button"
//               onClick={handleSelectAllStudents}
//               className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
//             >
//               Select All Students
//             </button>
//             <button
//               type="button"
//               onClick={handleClearAllStudents}
//               className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition"
//             >
//               Clear All
//             </button>
//             <span className="text-xs text-gray-500 self-center">
//               {form.studentIds.length} student(s) selected
//             </span>
//           </div>
//           <select name="studentIds" value={form.studentIds} onChange={handleChange} className="w-full border rounded px-3 py-2" multiple size={5}>
//             {Array.isArray(students) && students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.registrationNumber})</option>)}
//           </select>
//         </div>
//         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
//         {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
//         <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={assigning}>
//           {assigning ? <Loader /> : 'Assign Course'}
//         </button>
//       </form>
//     </div>
//   );
// } 
///////////////////////////////---------------------RESPONSIVE DESIGN-----------------///////////////////////////
import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function AssignCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    courseId: '',
    teacherId: '',
    studentIds: []
  });
  const [regNumbers, setRegNumbers] = useState('');
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [detailedCourses, setDetailedCourses] = useState([]);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [uploading, setUploading] = useState({});
  const [uploadError, setUploadError] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState({});
  const [fileInputs, setFileInputs] = useState({});
  const [linkInputs, setLinkInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError('');

      try {
        const [coursesRes, teachersRes, studentsRes] = await Promise.all([
          api.get('/admin/courses', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/admin/teachers', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          api.get('/admin/students', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCourses(
          Array.isArray(coursesRes.data.courses)
            ? coursesRes.data.courses
            : []
        );

        setTeachers(
          Array.isArray(teachersRes.data)
            ? teachersRes.data
            : []
        );

        setStudents(
          Array.isArray(studentsRes.data)
            ? studentsRes.data
            : []
        );
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  const fetchDetailedCourses = async () => {
    setFetchingDetails(true);

    try {
      const res = await api.get('/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDetailedCourses(res.data.courses || []);
    } catch {
      setDetailedCourses([]);
    } finally {
      setFetchingDetails(false);
    }
  };

  useEffect(() => {
    fetchDetailedCourses();
    // eslint-disable-next-line
  }, [token, success]);

  const handleFileChange = (courseId, file) => {
    setFileInputs(f => ({ ...f, [courseId]: file }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));
  };

  const handleFileUpload = async (courseId) => {
    if (!fileInputs[courseId]) return;

    setUploading(u => ({ ...u, [courseId]: true }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));

    try {
      const formData = new FormData();
      formData.append('file', fileInputs[courseId]);
      formData.append('courseId', courseId);

      await api.post('/teacher/upload-resource', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUploadSuccess(s => ({
        ...s,
        [courseId]: 'File uploaded!'
      }));

      setFileInputs(f => ({
        ...f,
        [courseId]: null
      }));

      fetchDetailedCourses();
    } catch (err) {
      setUploadError(e => ({
        ...e,
        [courseId]:
          err.response?.data?.message || 'Upload failed'
      }));
    } finally {
      setUploading(u => ({
        ...u,
        [courseId]: false
      }));
    }
  };

  const handleLinkChange = (courseId, value) => {
    setLinkInputs(l => ({
      ...l,
      [courseId]: value
    }));

    setUploadError(e => ({
      ...e,
      [courseId]: ''
    }));

    setUploadSuccess(s => ({
      ...s,
      [courseId]: ''
    }));
  };

  const handleLinkUpload = async (courseId) => {
    if (!linkInputs[courseId]) return;

    setUploading(u => ({
      ...u,
      [courseId]: true
    }));

    setUploadError(e => ({
      ...e,
      [courseId]: ''
    }));

    setUploadSuccess(s => ({
      ...s,
      [courseId]: ''
    }));

    try {
      await api.put(
        `/teacher/courses/${courseId}`,
        {
          courseId,
          link: linkInputs[courseId]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUploadSuccess(s => ({
        ...s,
        [courseId]: 'Link added!'
      }));

      setLinkInputs(l => ({
        ...l,
        [courseId]: ''
      }));

      fetchDetailedCourses();
    } catch (err) {
      setUploadError(e => ({
        ...e,
        [courseId]:
          err.response?.data?.message ||
          'Failed to add link'
      }));
    } finally {
      setUploading(u => ({
        ...u,
        [courseId]: false
      }));
    }
  };

  const handleCommentChange = (courseId, value) => {
    setCommentInputs(c => ({
      ...c,
      [courseId]: value
    }));

    setCommentError(e => ({
      ...e,
      [courseId]: ''
    }));
  };

  const handleCommentSubmit = async (courseId) => {
    if (!commentInputs[courseId]) return;

    setCommentLoading(l => ({
      ...l,
      [courseId]: true
    }));

    setCommentError(e => ({
      ...e,
      [courseId]: ''
    }));

    try {
      await api.post(
        '/teacher/add-comment',
        {
          courseId,
          text: commentInputs[courseId]
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCommentInputs(c => ({
        ...c,
        [courseId]: ''
      }));

      fetchDetailedCourses();
    } catch (err) {
      setCommentError(e => ({
        ...e,
        [courseId]:
          err.response?.data?.message ||
          'Failed to add comment'
      }));
    } finally {
      setCommentLoading(l => ({
        ...l,
        [courseId]: false
      }));
    }
  };

  const handleChange = e => {
    const { name, value, options } = e.target;

    if (name === 'studentIds') {
      const selected = Array.from(options)
        .filter(o => o.selected)
        .map(o => o.value);

      setForm(f => ({
        ...f,
        studentIds: selected
      }));
    } else {
      setForm(f => ({
        ...f,
        [name]: value
      }));
    }

    setSuccess('');
    setError('');
  };

  const handleRegNumbersChange = e => {
    setRegNumbers(e.target.value);
    setSuccess('');
    setError('');
  };

  const handleSelectAllStudents = () => {
    const allStudentIds = students.map(s => s._id);

    setForm(f => ({
      ...f,
      studentIds: allStudentIds
    }));

    setSuccess('');
    setError('');
  };

  const handleClearAllStudents = () => {
    setForm(f => ({
      ...f,
      studentIds: []
    }));

    setSuccess('');
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setAssigning(true);
    setError('');
    setSuccess('');

    let studentIds = form.studentIds;

    if (regNumbers.trim()) {
      const regNums = regNumbers
        .split(/[,\n]+/)
        .map(s => s.trim())
        .filter(Boolean);

      try {
        const res = await api.get('/admin/students', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const allStudents = res.data || [];

        const found = allStudents.filter(s =>
          regNums.includes(s.registrationNumber)
        );

        if (found.length !== regNums.length) {
          const missing = regNums.filter(
            rn =>
              !found.some(
                s => s.registrationNumber === rn
              )
          );

          setError(
            'Invalid registration numbers: ' +
            missing.join(', ')
          );

          setAssigning(false);
          return;
        }

        studentIds = found.map(s => s._id);
      } catch (err) {
        setError(
          'Failed to look up registration numbers'
        );

        setAssigning(false);
        return;
      }
    }

    try {
      await api.post(
        '/admin/assign-course',
        {
          ...form,
          studentIds
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccess('Course assigned successfully!');
      setRegNumbers('');

      setForm(f => ({
        ...f,
        studentIds: []
      }));
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to assign course'
      );
    } finally {
      setAssigning(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8 px-4 break-words">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">

        <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
          Assign Courses
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Course */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Course
            </label>

            <select
              name="courseId"
              value={form.courseId}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            >
              <option value="">Select a course</option>

              {Array.isArray(courses) &&
                courses.map(c => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Teacher */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Teacher
            </label>

            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2"
            >
              <option value="">Select a teacher</option>

              {Array.isArray(teachers) &&
                teachers.map(t => (
                  <option
                    key={t._id}
                    value={t._id}
                  >
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Registration Numbers */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Assign Students (by Registration Number)
            </label>

            <textarea
              value={regNumbers}
              onChange={handleRegNumbersChange}
              className="w-full min-w-0 border rounded px-3 py-2 resize-y"
              placeholder="Enter registration numbers, separated by comma or newline"
              rows={2}
            />

            <div className="text-xs text-gray-500 mt-1 break-words">
              Or select students below:
            </div>
          </div>

          {/* Select Students */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Or Select Students
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllStudents}
                  className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition w-full sm:w-auto whitespace-nowrap"
                >
                  Select All Students
                </button>

                <button
                  type="button"
                  onClick={handleClearAllStudents}
                  className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition w-full sm:w-auto whitespace-nowrap"
                >
                  Clear All
                </button>
              </div>

              <span className="text-xs text-gray-500">
                {form.studentIds.length} student(s) selected
              </span>
            </div>

            <select
              name="studentIds"
              value={form.studentIds}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              multiple
              size={5}
            >
              {Array.isArray(students) &&
                students.map(s => (
                  <option
                    key={s._id}
                    value={s._id}
                  >
                    {s.name} ({s.registrationNumber})
                  </option>
                ))}
            </select>
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
            type="submit"
            className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2"
            disabled={assigning}
          >
            {assigning ? <Loader /> : 'Assign Course'}
          </button>

        </form>
      </div>
    </div>
  );
}