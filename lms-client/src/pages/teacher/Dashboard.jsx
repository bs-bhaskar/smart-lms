import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function TeacherDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedTimetables, setExpandedTimetables] = useState({});
  const [expandedComments, setExpandedComments] = useState({});

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/teacher/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Teacher dashboard response:', res.data);
        setData(res.data);
      } catch (err) {
        console.error('Teacher dashboard error:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [token]);

  const toggleTimetableExpansion = (courseId) => {
    setExpandedTimetables(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  const toggleCommentsExpansion = (courseId) => {
    setExpandedComments(prev => ({
      ...prev,
      [courseId]: !prev[courseId]
    }));
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Teacher Dashboard</h1>
      
      {/* Tab Navigation */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6">
        <button 
          className={`px-4 py-2 rounded w-full sm:w-auto ${activeTab === 'overview' ? 'bg-orange text-white' : 'bg-gray-200 text-gray-700'}`} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`px-4 py-2 rounded w-full sm:w-auto ${activeTab === 'scheduled' ? 'bg-orange text-white' : 'bg-gray-200 text-gray-700'}`} 
          onClick={() => setActiveTab('scheduled')}
        >
          Scheduled Classes
        </button>
        <button 
          className={`px-4 py-2 rounded w-full sm:w-auto ${activeTab === 'comments' ? 'bg-orange text-white' : 'bg-gray-200 text-gray-700'}`} 
          onClick={() => setActiveTab('comments')}
        >
          Course Comments
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="font-semibold mb-2">Assigned Subjects</h2>
            <ul className="list-disc ml-5 text-gray-700">
              {data.courses && data.courses.length ? data.courses.map(c => (
                <li key={c.id}>{c.title}</li>
              )) : <li>No subjects assigned.</li>}
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="font-semibold mb-2">Today's Classes</h2>
            <div className="grid grid-cols-1 gap-4">
              {data.timetables && data.timetables.length ? data.timetables
                .filter(t => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                  return t.schedule && t.schedule.some(slot => slot.day === today);
                })
                .map((t, i) => (
                  <div key={i} className="bg-orange/5 rounded-lg p-4 flex flex-col items-start">
                    <div className="text-base sm:text-lg font-semibold text-orange mb-1 break-words">{t?.course?.title || '-'}</div>
                    {t.schedule && t.schedule.filter(slot => {
                      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                      return slot.day === today;
                    }).map((slot, slotIndex) => (
                      <div key={slotIndex} className="text-gray-700">
                        <div><span className="font-medium">Time:</span> {slot.startTime || '-'} - {slot.endTime || '-'}</div>
                        {slot.notes && (
                          <div className="text-gray-600 text-sm break-words"><span className="font-medium">Notes:</span> {slot.notes}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )) : <div className="text-gray-500">No classes scheduled for today.</div>}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">All Scheduled Classes</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.courses && data.courses.length ? data.courses.map(course => (
              <div key={course.id} className="border rounded-lg p-3 sm:p-4 overflow-hidden break-words">
                <div className="text-base sm:text-lg font-semibold text-orange mb-2 break-words">{course.title}</div>
                <div className="text-gray-700 mb-2 break-words whitespace-pre-wrap">{course.description || 'No description'}</div>
                
                {/* Expandable Timetable Section */}
                <div className="mt-3">
                  <div 
                    className="flex items-center cursor-pointer text-orange font-medium break-words"
                    onClick={() => toggleTimetableExpansion(course.id)}
                  >
                    {expandedTimetables[course.id] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                    View Timetable
                  </div>
                  {expandedTimetables[course.id] && (
                    <div className="mt-2">
                      {data.timetables && data.timetables.filter(t => t.course && t.course._id === course.id).length ? (
                        data.timetables.filter(t => t.course && t.course._id === course.id).map((t, i) => (
                          <div key={i} className="bg-orange/5 rounded-lg p-3 mt-2 break-words overflow-hidden">
                            {t.schedule && t.schedule.length > 0 ? (
                              t.schedule.map((slot, slotIndex) => (
                                <div key={slotIndex} className="mb-2 last:mb-0">
                                  <div className="text-gray-700"><span className="font-medium">Day:</span> {slot.day || '-'}</div>
                                  <div className="text-gray-700"><span className="font-medium">Time:</span> {slot.startTime || '-'} - {slot.endTime || '-'}</div>
                                  {slot.notes && (
                                    <div className="text-gray-600 text-sm"><span className="font-medium">Notes:</span> {slot.notes}</div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500">No schedule defined.</div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 mt-2">No timetable assigned to this course.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )) : <div className="text-gray-500">No courses assigned.</div>}
          </div>
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-orange">Course Comments</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.courses && data.courses.length ? data.courses.map(course => (
              <div key={course.id} className="border rounded-lg p-3 sm:p-4 overflow-hidden">
                <div className="text-base sm:text-lg font-semibold text-orange mb-2 break-words">{course.title}</div>
                
                {/* Expandable Comments Section */}
                <div className="mt-3">
                  <div 
                    className="flex items-center cursor-pointer text-orange font-medium"
                    onClick={() => toggleCommentsExpansion(course.id)}
                  >
                    {expandedComments[course.id] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                    View Comments ({course.comments?.length || 0})
                  </div>
                  {expandedComments[course.id] && (
                    <div className="mt-2">
                      {course.comments && course.comments.length ? (
                        course.comments.map((comment, i) => (
                          <div key={i} className="bg-gray-50 rounded-lg p-3 mt-2">
                            <div className="text-gray-700 break-words whitespace-pre-wrap"><span className="font-medium">{comment.user}:</span> {comment.text}</div>
                            <div className="text-gray-500 text-sm mt-1">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 mt-2">No comments yet.</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )) : <div className="text-gray-500">No courses assigned.</div>}
          </div>
        </div>
      )}
    </div>
  );
} 