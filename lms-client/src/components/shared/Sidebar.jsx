// import React from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// export default function Sidebar() {
//   const { user, role } = useAuth();
//   const location = useLocation();

//   if (!user) return null;

//   const links = role === 'student' ? [
//     { to: '/student/dashboard', label: 'Dashboard' },
//     { to: '/student/courses', label: 'Courses' },
//     { to: '/student/timetable', label: 'Timetable' },
//     { to: '/student/messages', label: 'Messages' },
//     { to: '/student/tests', label: 'Tests' },
//     { to: '/student/results', label: 'Results' },
//     { to: '/student/profile', label: 'Profile' },
//   ] : role === 'teacher' ? [
//     { to: '/teacher/dashboard', label: 'Dashboard' },
//     { to: '/teacher/courses', label: 'Courses' },
//     { to: '/teacher/tests', label: 'Tests' },
//     { to: '/teacher/results', label: 'Results' },
//     { to: '/teacher/messenger', label: 'Messenger' },
//     { to: '/teacher/profile', label: 'Profile' },
//   ] : role === 'admin' ? [
//     { to: '/admin/dashboard', label: 'Dashboard' },
//     { to: '/admin/results', label: 'Results' },
//     // Add more admin links as needed
//   ] : [];

//   return (
//     <aside className="hidden md:flex flex-col w-56 h-screen bg-white border-r pt-20 px-4 fixed top-0 left-0 z-20">
//       <nav className="flex flex-col gap-2">
//         {links.map(link => (
//           <Link
//             key={link.to}
//             to={link.to}
//             className={`px-4 py-2 rounded font-medium transition hover:bg-orange/10 hover:text-orange ${location.pathname === link.to ? 'bg-orange/10 text-orange' : 'text-gray-700'}`}
//           >
//             {link.label}
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// } 
///////////////////////////////////////// RESPONSIVE SIDEBAR /////////////////////////////////////////
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, role } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const links =
    role === 'student'
      ? [
          { to: '/student/dashboard', label: 'Dashboard' },
          { to: '/student/courses', label: 'Courses' },
          { to: '/student/timetable', label: 'Timetable' },
          { to: '/student/messages', label: 'Messages' },
          { to: '/student/tests', label: 'Tests' },
          { to: '/student/results', label: 'Results' },
          { to: '/student/profile', label: 'Profile' },
        ]
      : role === 'teacher'
      ? [
          { to: '/teacher/dashboard', label: 'Dashboard' },
          { to: '/teacher/courses', label: 'Courses' },
          { to: '/teacher/tests', label: 'Tests' },
          { to: '/teacher/results', label: 'Results' },
          { to: '/teacher/messenger', label: 'Messenger' },
          { to: '/teacher/profile', label: 'Profile' },
        ]
      : role === 'admin'
      ? [
          { to: '/admin/dashboard', label: 'Dashboard' },
          { to: '/admin/results', label: 'Results' },
        ]
      : [];

  return (
    <aside
      className="
        hidden md:flex
        flex-col
        w-56
        h-[calc(100vh-4rem)]
        bg-white
        border-r
        fixed
        top-16
        left-0
        z-20
      "
    >
      <nav className="flex flex-col gap-2 p-4">
        {links.map((link) => {
          const isActive = location.pathname === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded font-medium transition
                ${
                  isActive
                    ? 'bg-orange/10 text-orange'
                    : 'text-gray-700 hover:bg-orange/10 hover:text-orange'
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}