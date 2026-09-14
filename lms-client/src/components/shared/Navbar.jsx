// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export default function Navbar() {
//   const { user, role, logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-30">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
//         <Link to={role === 'teacher' ? '/teacher/dashboard' : role === 'student' ? '/student/dashboard' : '/'} className="text-orange font-bold text-xl tracking-tight mr-8 flex-shrink-0">Learning Management System</Link>
//         <div className="flex-1 flex items-center justify-end gap-4">
//           {user && role === 'student' && (
//             <>
//               <Link to="/student/dashboard" className="hover:text-orange transition">Dashboard</Link>
//               <Link to="/student/courses" className="hover:text-orange transition">Courses</Link>
//               <Link to="/student/timetable" className="hover:text-orange transition">Timetable</Link>
//               <Link to="/student/profile" className="hover:text-orange transition">Profile</Link>
//             </>
//           )}
//           {user && role === 'teacher' && (
//             <>
//               <Link to="/teacher/dashboard" className="hover:text-orange transition">Dashboard</Link>
//               <Link to="/teacher/courses" className="hover:text-orange transition">Courses</Link>
//               <Link to="/teacher/messenger" className="hover:text-orange transition">Messenger</Link>
//               <Link to="/teacher/profile" className="hover:text-orange transition">Profile</Link>
//             </>
//           )}
//           {user ? (
//             <button onClick={handleLogout} className="ml-2 px-3 py-1 rounded bg-orange text-white font-semibold hover:bg-orange-dark transition">Logout</button>
//           ) : (
//             <>
//               <Link to="/login" className="hover:text-orange transition">Login</Link>
//               <Link to="/register" className="hover:text-orange transition">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// } 
//////////////////////////////////---------RESPONSIVE NAVBAR---------/////////////////////////////////////
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const getHomeLink = () => {
    if (role === 'teacher') return '/teacher/dashboard';
    if (role === 'student') return '/student/dashboard';
    if (role === 'admin') return '/admin/dashboard';
    return '/';
  };

  return (
    <>
      <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to={getHomeLink()}
            onClick={() => setMobileMenuOpen(false)}
            className="text-orange font-bold text-lg sm:text-xl tracking-tight"
          >
            <span className="hidden sm:inline">
              Learning Management System
            </span>
            <span className="sm:hidden">
              LMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-4">

            {user && role === 'student' && (
              <>
                <Link
                  to="/student/dashboard"
                  className="hover:text-orange transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/student/courses"
                  className="hover:text-orange transition"
                >
                  Courses
                </Link>

                <Link
                  to="/student/timetable"
                  className="hover:text-orange transition"
                >
                  Timetable
                </Link>

                <Link
                  to="/student/profile"
                  className="hover:text-orange transition"
                >
                  Profile
                </Link>
              </>
            )}

            {user && role === 'teacher' && (
              <>
                <Link
                  to="/teacher/dashboard"
                  className="hover:text-orange transition"
                >
                  Dashboard
                </Link>

                <Link
                  to="/teacher/courses"
                  className="hover:text-orange transition"
                >
                  Courses
                </Link>

                <Link
                  to="/teacher/messenger"
                  className="hover:text-orange transition"
                >
                  Messenger
                </Link>

                <Link
                  to="/teacher/profile"
                  className="hover:text-orange transition"
                >
                  Profile
                </Link>
              </>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-1 rounded bg-orange text-white font-semibold hover:bg-orange-dark transition"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-orange transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="hover:text-orange transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 text-xl p-2"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">

            <div className="px-4 py-3 flex flex-col gap-1">

              {user && role === 'student' && (
                <>
                  <Link
                    to="/student/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/student/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Courses
                  </Link>

                  <Link
                    to="/student/timetable"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Timetable
                  </Link>

                  <Link
                    to="/student/messages"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Messages
                  </Link>

                  <Link
                    to="/student/tests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Tests
                  </Link>

                  <Link
                    to="/student/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Results
                  </Link>

                  <Link
                    to="/student/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Profile
                  </Link>
                </>
              )}

              {user && role === 'teacher' && (
                <>
                  <Link
                    to="/teacher/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/teacher/courses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Courses
                  </Link>

                  <Link
                    to="/teacher/tests"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Tests
                  </Link>

                  <Link
                    to="/teacher/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Results
                  </Link>

                  <Link
                    to="/teacher/messenger"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Messenger
                  </Link>

                  <Link
                    to="/teacher/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Profile
                  </Link>
                </>
              )}

              {user && role === 'admin' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/admin/results"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Results
                  </Link>
                </>
              )}

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-2 px-4 py-3 rounded bg-orange text-white font-semibold text-left"
                >
                  Logout
                </button>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded hover:bg-orange/10 hover:text-orange transition"
                  >
                    Register
                  </Link>
                </>
              )}

            </div>
          </div>
        )}
      </nav>
    </>
  );
}