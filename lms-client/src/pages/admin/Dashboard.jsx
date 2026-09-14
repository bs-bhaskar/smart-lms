// import React, { useEffect, useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';
// import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

// export default function AdminDashboard() {
//   const { token } = useAuth();
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [tab, setTab] = useState('dashboard');
//   const [courses, setCourses] = useState([]);
//   const [timetables, setTimetables] = useState([]);
//   const [coursesLoading, setCoursesLoading] = useState(false);
//   const [expandedCourses, setExpandedCourses] = useState({});
//   const [editingCourse, setEditingCourse] = useState(null);

//   // Create Course form state
//   const [courseForm, setCourseForm] = useState({ title: '', description: '', teacherId: '' });
//   const [courseLoading, setCourseLoading] = useState(false);
//   const [courseError, setCourseError] = useState('');
//   const [courseSuccess, setCourseSuccess] = useState('');
//   const [teachers, setTeachers] = useState([]);

//   const fetchCoursesAndTimetables = async () => {
//     setCoursesLoading(true);
//     try {
//       const resCourses = await api.get('/admin/courses', { headers: { Authorization: `Bearer ${token}` } });
//       console.log('Courses response:', resCourses.data);
//       setCourses(resCourses.data.courses || []);
//       const resTimetables = await api.get('/admin/timetables', { headers: { Authorization: `Bearer ${token}` } });
//       console.log('Timetables response:', resTimetables.data);
//       setTimetables(resTimetables.data.timetables || []);
//     } catch (err) {
//       console.error('Error fetching courses/timetables:', err);
//       // ignore error for now
//     } finally {
//       setCoursesLoading(false);
//     }
//   };

//   const toggleCourseExpansion = (courseId) => {
//     setExpandedCourses(prev => ({
//       ...prev,
//       [courseId]: !prev[courseId]
//     }));
//   };

//   useEffect(() => {
//     async function fetchStats() {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await api.get('/admin/monitor', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setStats(res.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load dashboard');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchStats();
//   }, [token]);

//   useEffect(() => {
//     async function fetchTeachers() {
//       try {
//         const res = await api.get('/admin/teachers', { headers: { Authorization: `Bearer ${token}` } });
//         setTeachers(res.data || []);
//       } catch (err) {
//         // ignore error for now
//       }
//     }
//     fetchTeachers();
//   }, [token]);

//   useEffect(() => {
//     // Always fetch courses and timetables when component mounts
//     fetchCoursesAndTimetables();
//   }, [token]);

//   const handleCourseChange = e => {
//     setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
//     setCourseError('');
//     setCourseSuccess('');
//   };

//   const handleCourseSubmit = async e => {
//     e.preventDefault();
//     setCourseLoading(true);
//     setCourseError('');
//     setCourseSuccess('');
//     try {
//       console.log('Creating course with data:', courseForm);
//       const response = await api.post('/admin/courses', courseForm, { headers: { Authorization: `Bearer ${token}` } });
//       console.log('Course creation response:', response.data);
//       setCourseSuccess('Course created successfully!');
//       setCourseForm({ title: '', description: '', teacherId: '' });
//       // Refresh courses list regardless of current tab
//       fetchCoursesAndTimetables();
//     } catch (err) {
//       console.error('Course creation error:', err);
//       setCourseError(err.response?.data?.message || 'Failed to create course');
//     } finally {
//       setCourseLoading(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
//   if (!stats) return null;

//   return (
//     <div className="max-w-4xl mx-auto mt-8">
//       <h1 className="text-2xl font-bold text-orange mb-6">Admin Dashboard</h1>
//       <div className="flex gap-4 mb-6">
//         <button className={`px-4 py-2 rounded ${tab === 'dashboard' ? 'bg-orange text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTab('dashboard')}>Dashboard</button>
//         <button className={`px-4 py-2 rounded ${tab === 'timetables' ? 'bg-orange text-white' : 'bg-gray-200 text-gray-700'}`} onClick={() => setTab('timetables')}>Courses & Timetables</button>
//       </div>
//       {tab === 'dashboard' && (
//         <>
//           {/* Create Course Form */}
//           <div className="bg-white rounded-xl shadow p-6 mb-8">
//             <h2 className="text-xl font-semibold mb-4 text-orange">Create New Course</h2>
//             <form onSubmit={handleCourseSubmit} className="grid gap-4 md:grid-cols-3">
//               <div className="md:col-span-1">
//                 <label className="block mb-1 font-medium">Course Title</label>
//                 <input
//                   type="text"
//                   name="title"
//                   value={courseForm.title}
//                   onChange={handleCourseChange}
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//                   required
//                 />
//               </div>
//               <div className="md:col-span-1">
//                 <label className="block mb-1 font-medium">Description</label>
//                 <input
//                   type="text"
//                   name="description"
//                   value={courseForm.description}
//                   onChange={handleCourseChange}
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//                   placeholder="Optional"
//                 />
//               </div>
//               <div className="md:col-span-1">
//                 <label className="block mb-1 font-medium">Teacher</label>
//                 <select
//                   name="teacherId"
//                   value={courseForm.teacherId}
//                   onChange={handleCourseChange}
//                   className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//                   required
//                 >
//                   <option value="">Select a teacher</option>
//                   {teachers.map(t => (
//                     <option key={t._id} value={t._id}>{t.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="md:col-span-3 flex items-center gap-4 mt-2">
//                 <button type="submit" className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition" disabled={courseLoading}>
//                   {courseLoading ? <Loader /> : 'Create Course'}
//                 </button>
//                 {courseError && <div className="text-red-600 text-sm">{courseError}</div>}
//                 {courseSuccess && <div className="text-green-600 text-sm">{courseSuccess}</div>}
//               </div>
//             </form>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-xl shadow p-6 text-center">
//               <div className="text-3xl font-bold text-orange">{stats.userCount}</div>
//               <div className="text-gray-600">Users</div>
//             </div>
//             <div className="bg-white rounded-xl shadow p-6 text-center">
//               <div className="text-3xl font-bold text-orange">{stats.courseCount}</div>
//               <div className="text-gray-600">Courses</div>
//             </div>
//             <div className="bg-white rounded-xl shadow p-6 text-center">
//               <div className="text-3xl font-bold text-orange">{stats.timetableCount}</div>
//               <div className="text-gray-600">Timetables</div>
//             </div>
//           </div>
//           {/* Links to other admin actions remain unchanged */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <a href="/admin/create-teacher" className="bg-white rounded-xl shadow p-6 hover:bg-orange/10 transition block">
//               <div className="font-semibold mb-2">Create Teacher Account</div>
//               <div className="text-gray-500 text-sm">Add a new teacher to the system</div>
//             </a>
//             <a href="/admin/manage-profiles" className="bg-white rounded-xl shadow p-6 hover:bg-orange/10 transition block">
//               <div className="font-semibold mb-2">Manage Profiles</div>
//               <div className="text-gray-500 text-sm">View and edit all student/teacher profiles</div>
//             </a>
//             <a href="/admin/upload-resources" className="bg-white rounded-xl shadow p-6 hover:bg-orange/10 transition block">
//               <div className="font-semibold mb-2">Upload Resources</div>
//               <div className="text-gray-500 text-sm">Upload platform-wide study materials</div>
//             </a>
//             <a href="/admin/assign-courses" className="bg-white rounded-xl shadow p-6 hover:bg-orange/10 transition block">
//               <div className="font-semibold mb-2">Assign Courses</div>
//               <div className="text-gray-500 text-sm">Assign courses to teachers/students</div>
//             </a>
//             <a href="/admin/assign-timetables" className="bg-white rounded-xl shadow p-6 hover:bg-orange/10 transition block">
//               <div className="font-semibold mb-2">Assign Timetables</div>
//               <div className="text-gray-500 text-sm">Set up class schedules</div>
//             </a>
//           </div>
//         </>
//       )}
//       {tab === 'timetables' && (
//         <div>
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl font-semibold text-orange">All Courses & Assigned Timetables</h2>
//             <div className="flex gap-2">
//               <button 
//                 onClick={fetchCoursesAndTimetables}
//                 disabled={coursesLoading}
//                 className="bg-orange text-white px-4 py-2 rounded hover:bg-orange-dark transition disabled:opacity-50"
//               >
//                 {coursesLoading ? 'Loading...' : 'Refresh'}
//               </button>
//             </div>
//           </div>
//           {coursesLoading ? (
//             <Loader />
//           ) : courses.length ? (
//             <div className="grid grid-cols-1 gap-4">
//               {courses.map(course => (
//                 <div key={course._id} className="bg-white rounded-xl shadow">
//                   <div
//                     className="flex items-center justify-between cursor-pointer px-6 py-4 border-b hover:bg-orange/5 transition"
//                     onClick={() => toggleCourseExpansion(course._id)}
//                   >
//                     <div className="flex items-center">
//                       {expandedCourses[course._id] ? <FaChevronDown className="mr-2 text-orange" /> : <FaChevronRight className="mr-2 text-orange" />}
//                       <span className="text-lg font-semibold text-orange">{course.title}</span>
//                     </div>
//                     <button
//                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm"
//                       onClick={e => { e.stopPropagation(); setEditingCourse(course); }}
//                     >
//                       Edit
//                     </button>
//                   </div>
//                   {expandedCourses[course._id] && (
//                     <div className="px-6 py-4">
//                       <div className="text-gray-700 mb-1"><span className="font-medium">Description:</span> {course.description || '-'}</div>
//                       <div className="text-gray-700 mb-2"><span className="font-medium">Teacher:</span> {course.teacher?.name || '-'}</div>
//                       <div className="text-gray-700 mb-2"><span className="font-medium">Students:</span> {course.students?.length || 0}</div>
//                       {/* Timetables for this course */}
//                       <div className="mt-4">
//                         <div className="font-medium text-orange mb-2">Assigned Timetables</div>
//                         {timetables.filter(t => String(t.course?._id || t.course) === String(course._id)).length ? (
//                           timetables.filter(t => String(t.course?._id || t.course) === String(course._id)).map((t, i) => (
//                             <div key={i} className="bg-orange/5 rounded-lg p-3 mb-2">
//                               <div className="text-gray-700 mb-1"><span className="font-medium">Timetable Teacher:</span> {t.teacher?.name || '-'}</div>
//                               <div className="text-gray-700 mb-1"><span className="font-medium">Timetable Students:</span> {Array.isArray(t.students) && t.students.length ? t.students.map(s => s.name).join(', ') : '-'}</div>
//                               {t.schedule && t.schedule.length > 0 ? (
//                                 t.schedule.map((slot, slotIndex) => (
//                                   <div key={slotIndex} className="mb-2 last:mb-0">
//                                     <div className="text-gray-700"><span className="font-medium">Day:</span> {slot.day || '-'}</div>
//                                     <div className="text-gray-700"><span className="font-medium">Time:</span> {slot.startTime || '-'} - {slot.endTime || '-'}</div>
//                                     {slot.notes && (
//                                       <div className="text-gray-600 text-sm"><span className="font-medium">Notes:</span> {slot.notes}</div>
//                                     )}
//                                   </div>
//                                 ))
//                               ) : (
//                                 <div className="text-gray-500">Timetable exists, but no schedule assigned yet.</div>
//                               )}
//                             </div>
//                           ))
//                         ) : (
//                           <div className="text-gray-500 mt-2">No timetable assigned.</div>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="col-span-2 text-center text-gray-500">No courses found. Please create one!</div>
//           )}
//         </div>
//       )}
//       {/* Edit Course Modal */}
//       {editingCourse && (
//         <EditCourseModal
//           course={editingCourse}
//           teachers={teachers}
//           onClose={() => setEditingCourse(null)}
//           onSave={async (updated) => {
//             try {
//               await api.put(`/admin/courses/${editingCourse._id}`, updated, { headers: { Authorization: `Bearer ${token}` } });
//               setEditingCourse(null);
//               fetchCoursesAndTimetables();
//             } catch (err) {
//               alert('Failed to update course: ' + (err.response?.data?.message || err.message));
//             }
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function EditCourseModal({ course, teachers, onClose, onSave }) {
//   const [form, setForm] = useState({
//     title: course?.title || '',
//     description: course?.description || '',
//     teacherId: course?.teacher?._id || '',
//     studentIds: Array.isArray(course?.students) ? course.students.map(s => s._id) : [],
//   });
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleStudentChange = e => {
//     const value = Array.from(e.target.selectedOptions).map(opt => opt.value);
//     setForm({ ...form, studentIds: value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setSaving(true);
//     setError('');
//     try {
//       await onSave(form);
//     } catch (err) {
//       setError(err?.message || 'Failed to update course.');
//     }
//     setSaving(false);
//   };

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
//         <button className="absolute top-2 right-2 text-gray-500 hover:text-orange" onClick={onClose}>&times;</button>
//         <h2 className="text-xl font-semibold mb-4 text-orange">Edit Course</h2>
//         <form onSubmit={handleSubmit} className="grid gap-4">
//           <div>
//             <label className="block mb-1 font-medium">Title</label>
//             <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Description</label>
//             <input type="text" name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" />
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Teacher</label>
//             <select name="teacherId" value={form.teacherId} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
//               <option value="">Select a teacher</option>
//               {(Array.isArray(teachers) ? teachers : []).length > 0 ? (
//                 teachers.map(t => (
//                   <option key={t._id} value={t._id}>{t.name}</option>
//                 ))
//               ) : (
//                 <option value="" disabled>No teachers available</option>
//               )}
//             </select>
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Students</label>
//             <select name="studentIds" value={form.studentIds} onChange={handleStudentChange} className="w-full border rounded px-3 py-2" multiple>
//               {(Array.isArray(course?.students) ? course.students : []).length > 0 ? (
//                 course.students.map(s => (
//                   <option key={s._id} value={s._id}>{s.name}</option>
//                 ))
//               ) : (
//                 <option value="" disabled>No students available</option>
//               )}
//             </select>
//           </div>
//           {error && <div className="text-red-600 text-sm">{error}</div>}
//           <div className="flex gap-4 mt-2">
//             <button type="submit" className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
//             <button type="button" className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition" onClick={onClose}>Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
/////////////////////////-------------RESPONSIVE DESIGN------------------///////////////////////////
import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [timetables, setTimetables] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [editingCourse, setEditingCourse] = useState(null);

  // Create Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    teacherId: ''
  });
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState('');
  const [courseSuccess, setCourseSuccess] = useState('');
  const [teachers, setTeachers] = useState([]);

  const fetchCoursesAndTimetables = async () => {
    setCoursesLoading(true);

    try {
      const resCourses = await api.get('/admin/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Courses response:', resCourses.data);
      setCourses(resCourses.data.courses || []);

      const resTimetables = await api.get('/admin/timetables', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Timetables response:', resTimetables.data);
      setTimetables(resTimetables.data.timetables || []);
    } catch (err) {
      console.error(
        'Error fetching courses/timetables:',
        err
      );
    } finally {
      setCoursesLoading(false);
    }
  };

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/admin/monitor', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [token]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await api.get('/admin/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setTeachers(res.data || []);
      } catch (err) {
        // ignore error for now
      }
    }

    fetchTeachers();
  }, [token]);

  useEffect(() => {
    fetchCoursesAndTimetables();
  }, [token]);

  const handleCourseChange = e => {
    setCourseForm({
      ...courseForm,
      [e.target.name]: e.target.value
    });

    setCourseError('');
    setCourseSuccess('');
  };

  const handleCourseSubmit = async e => {
    e.preventDefault();

    setCourseLoading(true);
    setCourseError('');
    setCourseSuccess('');

    try {
      console.log(
        'Creating course with data:',
        courseForm
      );

      const response = await api.post(
        '/admin/courses',
        courseForm,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log(
        'Course creation response:',
        response.data
      );

      setCourseSuccess(
        'Course created successfully!'
      );

      setCourseForm({
        title: '',
        description: '',
        teacherId: ''
      });

      fetchCoursesAndTimetables();
    } catch (err) {
      console.error(
        'Course creation error:',
        err
      );

      setCourseError(
        err.response?.data?.message ||
        'Failed to create course'
      );
    } finally {
      setCourseLoading(false);
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

  if (!stats) return null;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">

      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
        Admin Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-5 sm:mb-6">
        <button
          className={`px-4 py-2 rounded w-full sm:w-auto ${
            tab === 'dashboard'
              ? 'bg-orange text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setTab('dashboard')}
        >
          Dashboard
        </button>

        <button
          className={`px-4 py-2 rounded w-full sm:w-auto ${
            tab === 'timetables'
              ? 'bg-orange text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setTab('timetables')}
        >
          Courses & Timetables
        </button>
      </div>

      {tab === 'dashboard' && (
        <>
          {/* Create Course Form */}
          <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">
              Create New Course
            </h2>

            <form
              onSubmit={handleCourseSubmit}
              className="grid gap-4 md:grid-cols-3"
            >
              <div className="min-w-0">
                <label className="block mb-1 font-medium">
                  Course Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={courseForm.title}
                  onChange={handleCourseChange}
                  className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
                  required
                />
              </div>

              <div className="min-w-0">
                <label className="block mb-1 font-medium">
                  Description
                </label>

                <textarea
                  name="description"
                  value={courseForm.description}
                  onChange={handleCourseChange}
                  className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange resize-y"
                  placeholder="Enter course description..."
                  rows={3}
                />
              </div>

              <div className="min-w-0">
                <label className="block mb-1 font-medium">
                  Teacher
                </label>

                <select
                  name="teacherId"
                  value={courseForm.teacherId}
                  onChange={handleCourseChange}
                  className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
                  required
                >
                  <option value="">
                    Select a teacher
                  </option>

                  {teachers.map(t => (
                    <option
                      key={t._id}
                      value={t._id}
                    >
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                <button
                  type="submit"
                  className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition w-full sm:w-auto"
                  disabled={courseLoading}
                >
                  {courseLoading ? (
                    <Loader />
                  ) : (
                    'Create Course'
                  )}
                </button>

                {courseError && (
                  <div className="text-red-600 text-sm break-words">
                    {courseError}
                  </div>
                )}

                {courseSuccess && (
                  <div className="text-green-600 text-sm break-words">
                    {courseSuccess}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange">
                {stats.userCount}
              </div>
              <div className="text-gray-600">
                Users
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange">
                {stats.courseCount}
              </div>
              <div className="text-gray-600">
                Courses
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange">
                {stats.timetableCount}
              </div>
              <div className="text-gray-600">
                Timetables
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            <a
              href="/admin/create-teacher"
              className="bg-white rounded-xl shadow p-4 sm:p-6 hover:bg-orange/10 transition block overflow-hidden"
            >
              <div className="font-semibold mb-2">
                Create Teacher Account
              </div>

              <div className="text-gray-500 text-sm break-words">
                Add a new teacher to the system
              </div>
            </a>

            <a
              href="/admin/manage-profiles"
              className="bg-white rounded-xl shadow p-4 sm:p-6 hover:bg-orange/10 transition block overflow-hidden"
            >
              <div className="font-semibold mb-2">
                Manage Profiles
              </div>

              <div className="text-gray-500 text-sm break-words">
                View and edit all student/teacher profiles
              </div>
            </a>

            <a
              href="/admin/upload-resources"
              className="bg-white rounded-xl shadow p-4 sm:p-6 hover:bg-orange/10 transition block overflow-hidden"
            >
              <div className="font-semibold mb-2">
                Upload Resources
              </div>

              <div className="text-gray-500 text-sm break-words">
                Upload platform-wide study materials
              </div>
            </a>

            <a
              href="/admin/assign-courses"
              className="bg-white rounded-xl shadow p-4 sm:p-6 hover:bg-orange/10 transition block overflow-hidden"
            >
              <div className="font-semibold mb-2">
                Assign Courses
              </div>

              <div className="text-gray-500 text-sm break-words">
                Assign courses to teachers/students
              </div>
            </a>

            <a
              href="/admin/assign-timetables"
              className="bg-white rounded-xl shadow p-4 sm:p-6 hover:bg-orange/10 transition block overflow-hidden"
            >
              <div className="font-semibold mb-2">
                Assign Timetables
              </div>

              <div className="text-gray-500 text-sm break-words">
                Set up class schedules
              </div>
            </a>

          </div>
        </>
      )}

      {tab === 'timetables' && (
        <div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">

            <h2 className="text-lg sm:text-xl font-semibold text-orange break-words">
              All Courses & Assigned Timetables
            </h2>

            <div className="w-full sm:w-auto">
              <button
                onClick={fetchCoursesAndTimetables}
                disabled={coursesLoading}
                className="bg-orange text-white px-4 py-2 rounded hover:bg-orange-dark transition disabled:opacity-50 w-full sm:w-auto"
              >
                {coursesLoading
                  ? 'Loading...'
                  : 'Refresh'}
              </button>
            </div>

          </div>

          {coursesLoading ? (
            <Loader />
          ) : courses.length ? (
            <div className="grid grid-cols-1 gap-4">

              {courses.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow overflow-hidden"
                >

                  {/* Course Header */}
                  <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer px-4 sm:px-6 py-4 border-b hover:bg-orange/5 transition"
                    onClick={() =>
                      toggleCourseExpansion(course._id)
                    }
                  >

                    <div className="flex items-start min-w-0">
                      {expandedCourses[course._id] ? (
                        <FaChevronDown className="mr-2 mt-1 text-orange shrink-0" />
                      ) : (
                        <FaChevronRight className="mr-2 mt-1 text-orange shrink-0" />
                      )}

                      <span className="text-base sm:text-lg font-semibold text-orange break-words">
                        {course.title}
                      </span>
                    </div>

                    <button
                      className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition text-sm w-full sm:w-auto whitespace-nowrap"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingCourse(course);
                      }}
                    >
                      Edit
                    </button>

                  </div>

                  {expandedCourses[course._id] && (
                    <div className="px-4 sm:px-6 py-4">

                      <div className="text-gray-700 mb-1 break-words">
                        <span className="font-medium">
                          Description:
                        </span>{' '}
                        {course.description || '-'}
                      </div>

                      <div className="text-gray-700 mb-2 break-words">
                        <span className="font-medium">
                          Teacher:
                        </span>{' '}
                        {course.teacher?.name || '-'}
                      </div>

                      <div className="text-gray-700 mb-2">
                        <span className="font-medium">
                          Students:
                        </span>{' '}
                        {course.students?.length || 0}
                      </div>

                      {/* Timetables */}
                      <div className="mt-4">

                        <div className="font-medium text-orange mb-2">
                          Assigned Timetables
                        </div>

                        {timetables.filter(
                          t =>
                            String(
                              t.course?._id ||
                              t.course
                            ) === String(course._id)
                        ).length ? (

                          timetables
                            .filter(
                              t =>
                                String(
                                  t.course?._id ||
                                  t.course
                                ) ===
                                String(course._id)
                            )
                            .map((t, i) => (

                              <div
                                key={i}
                                className="bg-orange/5 rounded-lg p-3 mb-2 overflow-hidden"
                              >

                                <div className="text-gray-700 mb-1 break-words">
                                  <span className="font-medium">
                                    Timetable Teacher:
                                  </span>{' '}
                                  {t.teacher?.name || '-'}
                                </div>

                                <div className="text-gray-700 mb-1 break-words">
                                  <span className="font-medium">
                                    Timetable Students:
                                  </span>{' '}
                                  {Array.isArray(t.students) &&
                                  t.students.length
                                    ? t.students
                                        .map(s => s.name)
                                        .join(', ')
                                    : '-'}
                                </div>

                                {t.schedule &&
                                t.schedule.length > 0 ? (
                                  t.schedule.map(
                                    (slot, slotIndex) => (
                                      <div
                                        key={slotIndex}
                                        className="mb-2 last:mb-0 break-words"
                                      >

                                        <div className="text-gray-700">
                                          <span className="font-medium">
                                            Day:
                                          </span>{' '}
                                          {slot.day || '-'}
                                        </div>

                                        <div className="text-gray-700">
                                          <span className="font-medium">
                                            Time:
                                          </span>{' '}
                                          {slot.startTime || '-'} -{' '}
                                          {slot.endTime || '-'}
                                        </div>

                                        {slot.notes && (
                                          <div className="text-gray-600 text-sm break-words">
                                            <span className="font-medium">
                                              Notes:
                                            </span>{' '}
                                            {slot.notes}
                                          </div>
                                        )}

                                      </div>
                                    )
                                  )
                                ) : (
                                  <div className="text-gray-500 break-words">
                                    Timetable exists, but no schedule assigned yet.
                                  </div>
                                )}

                              </div>
                            ))
                        ) : (
                          <div className="text-gray-500 mt-2">
                            No timetable assigned.
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                </div>
              ))}

            </div>
          ) : (
            <div className="text-center text-gray-500 break-words">
              No courses found. Please create one!
            </div>
          )}

        </div>
      )}

      {/* Edit Course Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          teachers={teachers}
          onClose={() => setEditingCourse(null)}
          onSave={async (updated) => {
            try {
              await api.put(
                `/admin/courses/${editingCourse._id}`,
                updated,
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              setEditingCourse(null);
              fetchCoursesAndTimetables();
            } catch (err) {
              alert(
                'Failed to update course: ' +
                (
                  err.response?.data?.message ||
                  err.message
                )
              );
            }
          }}
        />
      )}
    </div>
  );
}

function EditCourseModal({
  course,
  teachers,
  onClose,
  onSave
}) {
  const [form, setForm] = useState({
    title: course?.title || '',
    description: course?.description || '',
    teacherId: course?.teacher?._id || '',
    studentIds: Array.isArray(course?.students)
      ? course.students.map(s => s._id)
      : []
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleStudentChange = e => {
    const value = Array.from(
      e.target.selectedOptions
    ).map(opt => opt.value);

    setForm({
      ...form,
      studentIds: value
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setSaving(true);
    setError('');

    try {
      await onSave(form);
    } catch (err) {
      setError(
        err?.message ||
        'Failed to update course.'
      );
    }

    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-3 py-4 overflow-y-auto">

      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">

        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-orange text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange pr-6">
          Edit Course
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4"
        >

          <div className="min-w-0">
            <label className="block mb-1 font-medium">
              Title
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            />
          </div>

          <div className="min-w-0">
            <label className="block mb-1 font-medium">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2 resize-y"
              rows={5}
            />
          </div>

          <div className="min-w-0">
            <label className="block mb-1 font-medium">
              Teacher
            </label>

            <select
              name="teacherId"
              value={form.teacherId}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            >
              <option value="">
                Select a teacher
              </option>

              {(Array.isArray(teachers)
                ? teachers
                : []
              ).length > 0 ? (
                teachers.map(t => (
                  <option
                    key={t._id}
                    value={t._id}
                  >
                    {t.name}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  disabled
                >
                  No teachers available
                </option>
              )}
            </select>
          </div>

          <div className="min-w-0">
            <label className="block mb-1 font-medium">
              Students
            </label>

            <select
              name="studentIds"
              value={form.studentIds}
              onChange={handleStudentChange}
              className="w-full min-w-0 border rounded px-3 py-2"
              multiple
            >
              {(Array.isArray(course?.students)
                ? course.students
                : []
              ).length > 0 ? (
                course.students.map(s => (
                  <option
                    key={s._id}
                    value={s._id}
                  >
                    {s.name}
                  </option>
                ))
              ) : (
                <option
                  value=""
                  disabled
                >
                  No students available
                </option>
              )}
            </select>
          </div>

          {error && (
            <div className="text-red-600 text-sm break-words">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">

            <button
              type="submit"
              className="bg-orange text-white font-semibold py-2 px-6 rounded hover:bg-orange-dark transition w-full sm:w-auto"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : 'Save Changes'}
            </button>

            <button
              type="button"
              className="bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}