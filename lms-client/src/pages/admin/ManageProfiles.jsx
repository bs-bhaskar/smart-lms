// import React, { useEffect, useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';

// export default function ManageProfiles() {
//   const { token } = useAuth();
//   const [students, setStudents] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [editId, setEditId] = useState(null);
//   const [editRole, setEditRole] = useState('');
//   const [editForm, setEditForm] = useState({ name: '', email: '' });
//   const [crudLoading, setCrudLoading] = useState(false);
//   const [crudError, setCrudError] = useState('');
//   const [crudSuccess, setCrudSuccess] = useState('');

//   const fetchProfiles = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const [studentsRes, teachersRes] = await Promise.all([
//         api.get('/admin/students', { headers: { Authorization: `Bearer ${token}` } }),
//         api.get('/admin/teachers', { headers: { Authorization: `Bearer ${token}` } })
//       ]);
//       setStudents(studentsRes.data || []);
//       setTeachers(teachersRes.data || []);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to load profiles');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchProfiles(); /* eslint-disable-next-line */ }, [token]);

//   const handleEdit = (user, role) => {
//     setEditId(user._id);
//     setEditRole(role);
//     setEditForm({ name: user.name, email: user.email });
//     setCrudError('');
//     setCrudSuccess('');
//   };

//   const handleEditChange = e => {
//     setEditForm({ ...editForm, [e.target.name]: e.target.value });
//   };

//   const handleEditSave = async () => {
//     setCrudLoading(true);
//     setCrudError('');
//     setCrudSuccess('');
//     try {
//       await api.put(`/admin/users/${editId}`, editForm, { headers: { Authorization: `Bearer ${token}` } });
//       setCrudSuccess('Profile updated!');
//       setEditId(null);
//       setEditRole('');
//       fetchProfiles();
//     } catch (err) {
//       setCrudError(err.response?.data?.message || 'Failed to update profile');
//     } finally {
//       setCrudLoading(false);
//     }
//   };

//   const handleEditCancel = () => {
//     setEditId(null);
//     setEditRole('');
//     setCrudError('');
//     setCrudSuccess('');
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm('Are you sure you want to delete this user?')) return;
//     setCrudLoading(true);
//     setCrudError('');
//     setCrudSuccess('');
//     try {
//       await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
//       setCrudSuccess('Profile deleted!');
//       fetchProfiles();
//     } catch (err) {
//       setCrudError(err.response?.data?.message || 'Failed to delete profile');
//     } finally {
//       setCrudLoading(false);
//     }
//   };

//   if (loading) return <Loader />;
//   if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

//   return (
//     <div className="max-w-5xl mx-auto mt-8">
//       <h1 className="text-2xl font-bold text-orange mb-6">Manage Profiles</h1>
//       {crudError && <div className="text-red-600 text-sm mb-3">{crudError}</div>}
//       {crudSuccess && <div className="text-green-600 text-sm mb-3">{crudSuccess}</div>}
//       <div className="mb-8">
//         <h2 className="font-semibold mb-2">Students</h2>
//         <table className="w-full text-left border mb-4">
//           <thead>
//             <tr className="bg-orange/10">
//               <th className="p-2">Name</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">Reg. Number</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length ? students.map(s => (
//               <tr key={s._id}>
//                 <td className="p-2">
//                   {editId === s._id ? (
//                     <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
//                   ) : s.name}
//                 </td>
//                 <td className="p-2">
//                   {editId === s._id ? (
//                     <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
//                   ) : s.email}
//                 </td>
//                 <td className="p-2">{s.registrationNumber}</td>
//                 <td className="p-2 flex gap-2">
//                   {editId === s._id ? (
//                     <>
//                       <button onClick={handleEditSave} className="bg-orange text-white px-2 py-1 rounded" disabled={crudLoading}>Save</button>
//                       <button onClick={handleEditCancel} className="bg-gray-300 text-gray-700 px-2 py-1 rounded">Cancel</button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => handleEdit(s, 'student')} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
//                       <button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white px-2 py-1 rounded" disabled={crudLoading}>Delete</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             )) : <tr><td colSpan={4} className="p-2 text-center">No students found.</td></tr>}
//           </tbody>
//         </table>
//       </div>
//       <div>
//         <h2 className="font-semibold mb-2">Teachers</h2>
//         <table className="w-full text-left border">
//           <thead>
//             <tr className="bg-orange/10">
//               <th className="p-2">Name</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">Reg. Number</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {teachers.length ? teachers.map(t => (
//               <tr key={t._id}>
//                 <td className="p-2">
//                   {editId === t._id ? (
//                     <input type="text" name="name" value={editForm.name} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
//                   ) : t.name}
//                 </td>
//                 <td className="p-2">
//                   {editId === t._id ? (
//                     <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
//                   ) : t.email}
//                 </td>
//                 <td className="p-2">{t.registrationNumber}</td>
//                 <td className="p-2 flex gap-2">
//                   {editId === t._id ? (
//                     <>
//                       <button onClick={handleEditSave} className="bg-orange text-white px-2 py-1 rounded" disabled={crudLoading}>Save</button>
//                       <button onClick={handleEditCancel} className="bg-gray-300 text-gray-700 px-2 py-1 rounded">Cancel</button>
//                     </>
//                   ) : (
//                     <>
//                       <button onClick={() => handleEdit(t, 'teacher')} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
//                       <button onClick={() => handleDelete(t._id)} className="bg-red-500 text-white px-2 py-1 rounded" disabled={crudLoading}>Delete</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             )) : <tr><td colSpan={4} className="p-2 text-center">No teachers found.</td></tr>}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// } 
///////////////////////----------------------RESPONSIVE DESIGN-----------------///////////////////////////
import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function ManageProfiles() {
  const { token } = useAuth();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [crudLoading, setCrudLoading] = useState(false);
  const [crudError, setCrudError] = useState('');
  const [crudSuccess, setCrudSuccess] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    setError('');
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        api.get('/admin/students', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        api.get('/admin/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStudents(studentsRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
    // eslint-disable-next-line
  }, [token]);

  const handleEdit = (user, role) => {
    setEditId(user._id);
    setEditRole(role);
    setEditForm({ name: user.name, email: user.email });
    setCrudError('');
    setCrudSuccess('');
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setCrudLoading(true);
    setCrudError('');
    setCrudSuccess('');

    try {
      await api.put(
        `/admin/users/${editId}`,
        editForm,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCrudSuccess('Profile updated!');
      setEditId(null);
      setEditRole('');
      fetchProfiles();
    } catch (err) {
      setCrudError(
        err.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setCrudLoading(false);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditRole('');
    setCrudError('');
    setCrudSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    setCrudLoading(true);
    setCrudError('');
    setCrudSuccess('');

    try {
      await api.delete(
        `/admin/users/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setCrudSuccess('Profile deleted!');
      fetchProfiles();
    } catch (err) {
      setCrudError(
        err.response?.data?.message || 'Failed to delete profile'
      );
    } finally {
      setCrudLoading(false);
    }
  };

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="text-red-600 text-center mt-8 px-3 break-words">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8 min-w-0">

      {/* Heading */}
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
        Manage Profiles
      </h1>

      {/* CRUD Messages */}
      {crudError && (
        <div className="text-red-600 text-sm mb-3 break-words">
          {crudError}
        </div>
      )}

      {crudSuccess && (
        <div className="text-green-600 text-sm mb-3 break-words">
          {crudSuccess}
        </div>
      )}

      {/* ================= STUDENTS ================= */}
      <div className="mb-8">
        <h2 className="font-semibold mb-2 text-base sm:text-lg">
          Students
        </h2>

        {/* Horizontal scroll on mobile */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border mb-4">
            <thead>
              <tr className="bg-orange/10">
                <th className="p-2 sm:p-3">Name</th>
                <th className="p-2 sm:p-3">Email</th>
                <th className="p-2 sm:p-3">Reg. Number</th>
                <th className="p-2 sm:p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {students.length ? (
                students.map(s => (
                  <tr key={s._id}>

                    {/* Name */}
                    <td className="p-2 sm:p-3 break-words">
                      {editId === s._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full min-w-0"
                        />
                      ) : (
                        s.name
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-2 sm:p-3 break-all">
                      {editId === s._id ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full min-w-0"
                        />
                      ) : (
                        s.email
                      )}
                    </td>

                    {/* Registration Number */}
                    <td className="p-2 sm:p-3 break-words">
                      {s.registrationNumber}
                    </td>

                    {/* Actions */}
                    <td className="p-2 sm:p-3">
                      {editId === s._id ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={handleEditSave}
                            className="bg-orange text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                            disabled={crudLoading}
                          >
                            Save
                          </button>

                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEdit(s, 'student')}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(s._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                            disabled={crudLoading}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-2 sm:p-3 text-center"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= TEACHERS ================= */}
      <div>
        <h2 className="font-semibold mb-2 text-base sm:text-lg">
          Teachers
        </h2>

        {/* Horizontal scroll on mobile */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border">
            <thead>
              <tr className="bg-orange/10">
                <th className="p-2 sm:p-3">Name</th>
                <th className="p-2 sm:p-3">Email</th>
                <th className="p-2 sm:p-3">Reg. Number</th>
                <th className="p-2 sm:p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {teachers.length ? (
                teachers.map(t => (
                  <tr key={t._id}>

                    {/* Name */}
                    <td className="p-2 sm:p-3 break-words">
                      {editId === t._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full min-w-0"
                        />
                      ) : (
                        t.name
                      )}
                    </td>

                    {/* Email */}
                    <td className="p-2 sm:p-3 break-all">
                      {editId === t._id ? (
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="border rounded px-2 py-1 w-full min-w-0"
                        />
                      ) : (
                        t.email
                      )}
                    </td>

                    {/* Registration Number */}
                    <td className="p-2 sm:p-3 break-words">
                      {t.registrationNumber}
                    </td>

                    {/* Actions */}
                    <td className="p-2 sm:p-3">
                      {editId === t._id ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={handleEditSave}
                            className="bg-orange text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                            disabled={crudLoading}
                          >
                            Save
                          </button>

                          <button
                            onClick={handleEditCancel}
                            className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => handleEdit(t, 'teacher')}
                            className="bg-blue-500 text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(t._id)}
                            className="bg-red-500 text-white px-3 py-1.5 rounded w-full sm:w-auto whitespace-nowrap"
                            disabled={crudLoading}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="p-2 sm:p-3 text-center"
                  >
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}