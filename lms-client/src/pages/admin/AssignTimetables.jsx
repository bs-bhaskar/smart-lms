// import React, { useEffect, useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';

// const WEEK_DAYS = [
//   'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
// ];

// export default function AssignTimetables() {
//   const { token } = useAuth();
//   const [courses, setCourses] = useState([]);
//   const [form, setForm] = useState({ courseId: '', schedule: [{ day: '', startTime: '', endTime: '', notes: '' }] });
//   const [loading, setLoading] = useState(true);
//   const [assigning, setAssigning] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   useEffect(() => {
//     async function fetchCourses() {
//       setLoading(true);
//       setError('');
//       try {
//         const res = await api.get('/admin/courses', { headers: { Authorization: `Bearer ${token}` } });
//         console.log('AssignTimetables courses response:', res.data);
//         setCourses(res.data.courses || []);
//       } catch (err) {
//         console.error('AssignTimetables courses error:', err);
//         setError(err.response?.data?.message || 'Failed to load courses');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchCourses();
//   }, [token]);

//   const handleChange = (e, index) => {
//     const { name, value } = e.target;
//     if (name === 'courseId') {
//       setForm(f => ({ ...f, courseId: value }));
//     } else {
//       const newSchedule = [...form.schedule];
//       newSchedule[index] = { ...newSchedule[index], [name]: value };
//       setForm(f => ({ ...f, schedule: newSchedule }));
//     }
//     setSuccess('');
//     setError('');
//   };

//   const addScheduleSlot = () => {
//     setForm(f => ({ ...f, schedule: [...f.schedule, { day: '', startTime: '', endTime: '', notes: '' }] }));
//   };

//   const removeScheduleSlot = (index) => {
//     setForm(f => ({ ...f, schedule: f.schedule.filter((_, i) => i !== index) }));
//   };

//   const handleWeekFill = () => {
//     // Fill schedule with all week days, one slot per day
//     setForm(f => ({
//       ...f,
//       schedule: WEEK_DAYS.map(day => ({ day, startTime: '', endTime: '', notes: '' }))
//     }));
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setAssigning(true);
//     setError('');
//     setSuccess('');
    
//     // Validate that schedule slots have times
//     const validSchedule = form.schedule.filter(slot => 
//       slot.day && slot.startTime && slot.endTime
//     );
    
//     if (validSchedule.length === 0) {
//       setError('Please fill in at least one schedule slot with day, start time, and end time.');
//       setAssigning(false);
//       return;
//     }
    
//     try {
//       console.log('Submitting timetable:', { courseId: form.courseId, schedule: validSchedule });
//       await api.post('/admin/assign-timetable', {
//         courseId: form.courseId,
//         schedule: validSchedule,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess('Timetable assigned successfully!');
//       setForm({ courseId: '', schedule: [{ day: '', startTime: '', endTime: '', notes: '' }] });
//     } catch (err) {
//       console.error('Timetable assignment error:', err);
//       setError(err.response?.data?.message || 'Failed to assign timetable');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

//   return (
//     <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow p-6">
//       <h1 className="text-2xl font-bold text-orange mb-6">Assign Timetables</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Course</label>
//           <select name="courseId" value={form.courseId} onChange={e => handleChange(e)} className="w-full border rounded px-3 py-2" required>
//             <option value="">Select a course</option>
//             {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
//           </select>
//         </div>
//         <h2 className="font-semibold text-lg mb-3">Schedule Slots</h2>
//         <button type="button" onClick={handleWeekFill} className="bg-gray-200 text-gray-700 font-semibold py-2 rounded hover:bg-gray-300 transition w-full mb-4">Fill All Week Days</button>
//         {form.schedule.map((slot, index) => (
//           <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4 p-4 border rounded-lg bg-gray-50">
//             <div>
//               <label className="block mb-1 text-sm">Day</label>
//               <select name="day" value={slot.day} onChange={e => handleChange(e, index)} className="w-full border rounded px-3 py-2 text-sm">
//                 <option value="">Select day</option>
//                 {WEEK_DAYS.map(day => <option key={day} value={day}>{day}</option>)}
//               </select>
//             </div>
//             <div>
//               <label className="block mb-1 text-sm">Start Time</label>
//               <input type="time" name="startTime" value={slot.startTime} onChange={e => handleChange(e, index)} className="w-full border rounded px-3 py-2 text-sm" />
//             </div>
//             <div>
//               <label className="block mb-1 text-sm">End Time</label>
//               <input type="time" name="endTime" value={slot.endTime} onChange={e => handleChange(e, index)} className="w-full border rounded px-3 py-2 text-sm" />
//             </div>
//             <div>
//               <label className="block mb-1 text-sm">Notes</label>
//               <input type="text" name="notes" value={slot.notes} onChange={e => handleChange(e, index)} className="w-full border rounded px-3 py-2 text-sm" placeholder="Optional" />
//             </div>
//             <div className="flex items-end">
//               <button type="button" onClick={() => removeScheduleSlot(index)} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm">Remove</button>
//             </div>
//           </div>
//         ))}
//         <button type="button" onClick={addScheduleSlot} className="bg-gray-200 text-gray-700 font-semibold py-2 rounded hover:bg-gray-300 transition w-full mb-4">Add Schedule Slot</button>
//         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
//         {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
//         <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={assigning}>
//           {assigning ? <Loader /> : 'Assign Timetable'}
//         </button>
//       </form>
//     </div>
//   );
// } 
///////////////////////////////-------------------RESPONSIVE DESIGN-----------------///////////////////////////
import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const WEEK_DAYS = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday',
  'Friday', 'Saturday', 'Sunday'
];

export default function AssignTimetables() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    courseId: '',
    schedule: [
      { day: '', startTime: '', endTime: '', notes: '' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');

      try {
        const res = await api.get('/admin/courses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(
          'AssignTimetables courses response:',
          res.data
        );

        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(
          'AssignTimetables courses error:',
          err
        );

        setError(
          err.response?.data?.message ||
          'Failed to load courses'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [token]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    if (name === 'courseId') {
      setForm(f => ({
        ...f,
        courseId: value
      }));
    } else {
      const newSchedule = [...form.schedule];

      newSchedule[index] = {
        ...newSchedule[index],
        [name]: value
      };

      setForm(f => ({
        ...f,
        schedule: newSchedule
      }));
    }

    setSuccess('');
    setError('');
  };

  const addScheduleSlot = () => {
    setForm(f => ({
      ...f,
      schedule: [
        ...f.schedule,
        {
          day: '',
          startTime: '',
          endTime: '',
          notes: ''
        }
      ]
    }));
  };

  const removeScheduleSlot = (index) => {
    setForm(f => ({
      ...f,
      schedule: f.schedule.filter((_, i) => i !== index)
    }));
  };

  const handleWeekFill = () => {
    setForm(f => ({
      ...f,
      schedule: WEEK_DAYS.map(day => ({
        day,
        startTime: '',
        endTime: '',
        notes: ''
      }))
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setAssigning(true);
    setError('');
    setSuccess('');

    const validSchedule = form.schedule.filter(
      slot =>
        slot.day &&
        slot.startTime &&
        slot.endTime
    );

    if (validSchedule.length === 0) {
      setError(
        'Please fill in at least one schedule slot with day, start time, and end time.'
      );

      setAssigning(false);
      return;
    }

    try {
      console.log(
        'Submitting timetable:',
        {
          courseId: form.courseId,
          schedule: validSchedule
        }
      );

      await api.post(
        '/admin/assign-timetable',
        {
          courseId: form.courseId,
          schedule: validSchedule
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        'Timetable assigned successfully!'
      );

      setForm({
        courseId: '',
        schedule: [
          {
            day: '',
            startTime: '',
            endTime: '',
            notes: ''
          }
        ]
      });
    } catch (err) {
      console.error(
        'Timetable assignment error:',
        err
      );

      setError(
        err.response?.data?.message ||
        'Failed to assign timetable'
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
          Assign Timetables
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
              onChange={e => handleChange(e)}
              className="w-full min-w-0 border rounded px-3 py-2"
              required
            >
              <option value="">
                Select a course
              </option>

              {courses.map(c => (
                <option
                  key={c._id}
                  value={c._id}
                >
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <h2 className="font-semibold text-base sm:text-lg mb-3">
            Schedule Slots
          </h2>

          {/* Fill Week */}
          <button
            type="button"
            onClick={handleWeekFill}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded hover:bg-gray-300 transition w-full mb-4"
          >
            Fill All Week Days
          </button>

          {/* Schedule Slots */}
          {form.schedule.map((slot, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 sm:gap-4 mb-4 p-3 sm:p-4 border rounded-lg bg-gray-50 overflow-hidden"
            >

              {/* Day */}
              <div className="min-w-0">
                <label className="block mb-1 text-sm">
                  Day
                </label>

                <select
                  name="day"
                  value={slot.day}
                  onChange={e =>
                    handleChange(e, index)
                  }
                  className="w-full min-w-0 border rounded px-3 py-2 text-sm"
                >
                  <option value="">
                    Select day
                  </option>

                  {WEEK_DAYS.map(day => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Time */}
              <div className="min-w-0">
                <label className="block mb-1 text-sm">
                  Start Time
                </label>

                <input
                  type="time"
                  name="startTime"
                  value={slot.startTime}
                  onChange={e =>
                    handleChange(e, index)
                  }
                  className="w-full min-w-0 border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* End Time */}
              <div className="min-w-0">
                <label className="block mb-1 text-sm">
                  End Time
                </label>

                <input
                  type="time"
                  name="endTime"
                  value={slot.endTime}
                  onChange={e =>
                    handleChange(e, index)
                  }
                  className="w-full min-w-0 border rounded px-3 py-2 text-sm"
                />
              </div>

              {/* Notes */}
              <div className="min-w-0">
                <label className="block mb-1 text-sm">
                  Notes
                </label>

                <input
                  type="text"
                  name="notes"
                  value={slot.notes}
                  onChange={e =>
                    handleChange(e, index)
                  }
                  className="w-full min-w-0 border rounded px-3 py-2 text-sm"
                  placeholder="Optional"
                />
              </div>

              {/* Remove */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() =>
                    removeScheduleSlot(index)
                  }
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm whitespace-nowrap"
                >
                  Remove
                </button>
              </div>

            </div>
          ))}

          {/* Add Slot */}
          <button
            type="button"
            onClick={addScheduleSlot}
            className="bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded hover:bg-gray-300 transition w-full mb-4"
          >
            Add Schedule Slot
          </button>

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

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2"
            disabled={assigning}
          >
            {assigning ? (
              <Loader />
            ) : (
              'Assign Timetable'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}