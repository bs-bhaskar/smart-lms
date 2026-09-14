// import React, { useState } from 'react';
// import Loader from '../../components/shared/Loader';
// import api from '../../api/axios';
// import { useAuth } from '../../context/AuthContext';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// export default function CreateTeacher() {
//   const { token } = useAuth();
//   const [form, setForm] = useState({ name: '', email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [regNumber, setRegNumber] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//     setSuccess('');
//     setRegNumber('');
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');
//     setRegNumber('');
//     try {
//       const res = await api.post('/admin/create-teacher', form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setSuccess(`Teacher created successfully! A welcome email with registration number has been sent to ${form.email}`);
//       setRegNumber(res.data.registrationNumber);
//       setForm({ name: '', email: '', password: '' });
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create teacher');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-8 bg-white rounded-xl shadow p-6">
//       <h1 className="text-2xl font-bold text-orange mb-6">Create Teacher Account</h1>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Full Name</label>
//           <input
//             type="text"
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//             required
//             autoFocus
//           />
//         </div>
//         <div className="mb-4">
//           <label className="block mb-1 font-medium">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={form.email}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//             required
//           />
//         </div>
//         <div className="mb-4 relative">
//           <label className="block mb-1 font-medium">Password</label>
//           <input
//             type={showPassword ? 'text' : 'password'}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
//             required
//           />
//           <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowPassword(v => !v)}>
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>
//         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
//         {success && (
//           <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
//             <div className="text-green-800 text-sm font-medium mb-1">✅ {success}</div>
//             {regNumber && (
//               <div className="text-green-700 text-xs">
//                 Registration Number: <span className="font-mono font-bold">{regNumber}</span>
//               </div>
//             )}
//           </div>
//         )}
//         <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={loading}>
//           {loading ? <Loader /> : 'Create Teacher'}
//         </button>
//       </form>
//     </div>
//   );
// } 
////////////////////////----------------------RESPONSIVE DESIGN-----------------///////////////////////////
import React, { useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function CreateTeacher() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [regNumber, setRegNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setError('');
    setSuccess('');
    setRegNumber('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');
    setRegNumber('');

    try {
      const res = await api.post(
        '/admin/create-teacher',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess(
        `Teacher created successfully! A welcome email with registration number has been sent to ${form.email}`
      );

      setRegNumber(res.data.registrationNumber);

      setForm({
        name: '',
        email: '',
        password: ''
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Failed to create teacher'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">

        <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">
          Create Teacher Account
        </h1>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
              required
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block mb-1 font-medium">
              Password
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
              required
            />

            <span
              className="absolute right-3 top-9 cursor-pointer text-gray-500"
              onClick={() =>
                setShowPassword(v => !v)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-600 text-sm mb-3 break-words">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
              <div className="text-green-800 text-sm font-medium mb-1 break-words">
                ✅ {success}
              </div>

              {regNumber && (
                <div className="text-green-700 text-xs break-words">
                  Registration Number:{' '}
                  <span className="font-mono font-bold">
                    {regNumber}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2"
            disabled={loading}
          >
            {loading ? (
              <Loader />
            ) : (
              'Create Teacher'
            )}
          </button>

        </form>
      </div>
    </div>
  );
}