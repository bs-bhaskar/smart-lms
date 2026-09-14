// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import Loader from '../../components/shared/Loader';
// // import { FaEye, FaEyeSlash } from 'react-icons/fa';

// // export default function AdminLogin() {
// //   const navigate = useNavigate();
// //   const [form, setForm] = useState({ username: '', password: '' });
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [showPassword, setShowPassword] = useState(false);

// //   const handleChange = e => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //     setError('');
// //   };

// //   const handleSubmit = async e => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError('');
// //     // Implement admin login logic here
// //     setTimeout(() => {
// //       setLoading(false);
// //       navigate('/admin/dashboard');
// //     }, 1000);
// //   };

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
// //       <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
// //         <h2 className="text-2xl font-bold text-orange mb-6 text-center">Admin Login</h2>
// //         <div className="mb-4">
// //           <label className="block mb-1 font-medium">Username</label>
// //           <input
// //             type="text"
// //             name="username"
// //             value={form.username}
// //             onChange={handleChange}
// //             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
// //             required
// //             autoFocus
// //           />
// //         </div>
// //         <div className="mb-4 relative">
// //           <label className="block mb-1 font-medium">Password</label>
// //           <input
// //             type={showPassword ? 'text' : 'password'}
// //             name="password"
// //             value={form.password}
// //             onChange={handleChange}
// //             className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
// //             required
// //           />
// //           <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowPassword(v => !v)}>
// //             {showPassword ? <FaEyeSlash /> : <FaEye />}
// //           </span>
// //         </div>
// //         {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
// //         <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={loading}>
// //           {loading ? <Loader /> : 'Login'}
// //         </button>
// //       </form>
// //     </div>
// //   );
// // } 
// ////////////////////////////////////-------RESPONSIVE DESIGN------------------///////////////////////////
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Loader from '../../components/shared/Loader';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// export default function AdminLogin() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ username: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     // Implement admin login logic here
//     setTimeout(() => {
//       setLoading(false);
//       navigate('/admin/dashboard');
//     }, 1000);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 px-3 sm:px-4 py-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-lg rounded-xl p-5 sm:p-8 w-full max-w-md"
//       >
//         <h2 className="text-xl sm:text-2xl font-bold text-orange mb-5 sm:mb-6 text-center">
//           Admin Login
//         </h2>

//         <div className="mb-4">
//           <label className="block mb-1 font-medium">
//             Username
//           </label>

//           <input
//             type="text"
//             name="username"
//             value={form.username}
//             onChange={handleChange}
//             className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
//             required
//             autoFocus
//           />
//         </div>

//         <div className="mb-4 relative">
//           <label className="block mb-1 font-medium">
//             Password
//           </label>

//           <input
//             type={showPassword ? 'text' : 'password'}
//             name="password"
//             value={form.password}
//             onChange={handleChange}
//             className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
//             required
//           />

//           <span
//             className="absolute right-3 top-9 cursor-pointer text-gray-500"
//             onClick={() => setShowPassword(v => !v)}
//           >
//             {showPassword ? <FaEyeSlash /> : <FaEye />}
//           </span>
//         </div>

//         {error && (
//           <div className="text-red-600 text-sm mb-3 break-words">
//             {error}
//           </div>
//         )}

//         <button
//           type="submit"
//           className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2"
//           disabled={loading}
//         >
//           {loading ? <Loader /> : 'Login'}
//         </button>
//       </form>
//     </div>
//   );
// }
//////////////////////////-----------RESPONSIVE AND BUG FREE CODE-----------------///////////////////////////
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data = await login({
        email: form.username,
        password: form.password
      });

      // Only admin can enter admin dashboard
      if (data.user?.role !== 'admin') {
        // Remove the authentication that login() just stored
        localStorage.removeItem('lmsAuth');
        localStorage.removeItem('lmsToken');

        throw new Error('Access denied. Admin account required.');
      }

      navigate('/admin/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Invalid admin credentials'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 px-3 sm:px-4 py-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-5 sm:p-8 w-full max-w-md"
      >

        <h2 className="text-xl sm:text-2xl font-bold text-orange mb-5 sm:mb-6 text-center">
          Admin Login
        </h2>

        {/* Username / Email */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">
            Username / Email
          </label>

          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            required
            autoFocus
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
            className="w-full min-w-0 border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange"
            required
          />

          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-600 text-sm mb-3 break-words">
            {error}
          </div>
        )}

        {/* Login */}
        <button
          type="submit"
          className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2"
          disabled={loading}
        >
          {loading ? <Loader /> : 'Login'}
        </button>

      </form>
    </div>
  );
}