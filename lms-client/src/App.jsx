import React from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Navbar from './components/shared/Navbar';
import Sidebar from './components/shared/Sidebar';
import Loader from './components/shared/Loader';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import TeacherRoute from './routes/TeacherRoute';
import AdminRoute from './routes/AdminRoute';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import ChangePassword from './pages/auth/ChangePassword';
// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentCourses from './pages/student/Courses';
import StudentTimetable from './pages/student/Timetable';
import StudentProfile from './pages/student/Profile';
import StudyBot from './pages/student/StudyBot';
import StudentMessages from './pages/student/Messages';
import StudentTests from './pages/student/Tests';
import StudentResults from './pages/student/Results';
import ParentReport from './pages/parent/ParentReport';
// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherCourses from './pages/teacher/Courses';
import AddMaterial from './pages/teacher/AddMaterial';
import Messenger from './pages/teacher/Messenger';
import TeacherProfile from './pages/teacher/Profile';
import TeacherTests from './pages/teacher/Tests';
import TeacherResults from './pages/teacher/Results';
// Admin pages (hidden from nav)
import AdminDashboard from './pages/admin/Dashboard';
import CreateTeacher from './pages/admin/CreateTeacher';
import ManageProfiles from './pages/admin/ManageProfiles';
import UploadResources from './pages/admin/UploadResources';
import AssignCourses from './pages/admin/AssignCourses';
import AssignTimetables from './pages/admin/AssignTimetables';
import AdminResults from './pages/admin/Results';

function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  // Hide sidebar on auth pages
  const hideSidebar = location.pathname.startsWith('/login') || location.pathname.startsWith('/register') || location.pathname.startsWith('/forgot-password') || location.pathname.startsWith('/reset-password');
  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex">
      <Navbar />
      {!hideSidebar && user && <Sidebar />}
      {/* ///////////////////////////----RESPONSIVE SIDEBAR----/////////////////////////// */}

      {/* <main className={`flex-1 ${!hideSidebar && user ? 'md:ml-56 pt-8 px-4' : 'pt-8 px-4'}`}> */}
      <main className={`flex-1 min-w-0 ${!hideSidebar && user ? 'md:ml-56 pt-8 px-3 sm:px-4' : 'pt-8 px-3 sm:px-4'}`}>
      
      {/* ///////////////////////////----RESPONSIVE SIDEBAR----/////////////////////////// */}
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <Loader />;
  return (
    <ErrorBoundary>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Public Parent Report */}
        <Route
          path="/parent-report/:studentId"
          element={<ParentReport />}
        />

        {/* Main layout with sidebar/navbar */}
        <Route element={<Layout />}>
          
          {/* Student protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/courses" element={<StudentCourses />} />
            <Route path="/student/timetable" element={<StudentTimetable />} />
            <Route path="/student/messages" element={<StudentMessages />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/studybot" element={<StudyBot />} />
            <Route path="/student/tests" element={<StudentTests />} />
            <Route path="/student/results" element={<StudentResults />} />
          </Route>
          {/* Teacher protected routes */}
          <Route element={<TeacherRoute />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/courses" element={<TeacherCourses />} />
            <Route path="/teacher/add-material" element={<AddMaterial />} />
            <Route path="/teacher/messenger" element={<Messenger />} />
            <Route path="/teacher/profile" element={<TeacherProfile />} />
            <Route path="/teacher/tests" element={<TeacherTests />} />
            <Route path="/teacher/results" element={<TeacherResults />} />
          </Route>
          {/* Admin protected routes (not in nav) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/create-teacher" element={<CreateTeacher />} />
            <Route path="/admin/manage-profiles" element={<ManageProfiles />} />
            <Route path="/admin/upload-resources" element={<UploadResources />} />
            <Route path="/admin/assign-courses" element={<AssignCourses />} />
            <Route path="/admin/assign-timetables" element={<AssignTimetables />} />
            <Route path="/admin/results" element={<AdminResults />} />
          </Route>
        </Route>
        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </ErrorBoundary>
  );
} 