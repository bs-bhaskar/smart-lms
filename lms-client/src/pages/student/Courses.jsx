import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function StudentCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});
  const [comments, setComments] = useState({});

  const handleExpand = async (courseId) => {
    setExpanded(e => ({ ...e, [courseId]: !e[courseId] }));
    if (!comments[courseId]) {
      try {
        const res = await api.get(`/student/courses/${courseId}/comments`, { headers: { Authorization: `Bearer ${token}` } });
        setComments(c => ({ ...c, [courseId]: res.data.comments }));
      } catch {}
    }
  };

  const handleCommentChange = (courseId, value) => {
    setCommentInputs(c => ({ ...c, [courseId]: value }));
    setCommentError(e => ({ ...e, [courseId]: '' }));
  };

  const handleCommentSubmit = async (courseId) => {
    if (!commentInputs[courseId]) return;
    setCommentLoading(l => ({ ...l, [courseId]: true }));
    setCommentError(e => ({ ...e, [courseId]: '' }));
    try {
      await api.post(`/student/courses/${courseId}/comment`, { courseId, text: commentInputs[courseId] }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentInputs(c => ({ ...c, [courseId]: '' }));
      // Refresh comments
      const res = await api.get(`/student/courses/${courseId}/comments`, { headers: { Authorization: `Bearer ${token}` } });
      setComments(c => ({ ...c, [courseId]: res.data.comments }));
    } catch (err) {
      setCommentError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Failed to add comment' }));
    } finally {
      setCommentLoading(l => ({ ...l, [courseId]: false }));
    }
  };

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [token]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">My Courses</h1>
      <div className="grid gap-6">
        {courses.length ? courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="flex items-center cursor-pointer" onClick={() => handleExpand(course.id)}>
              {expanded[course.id] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
              <h2 className="font-semibold text-lg mb-1">{course.title}</h2>
            </div>
            {expanded[course.id] && (
              <>
                <div className="text-gray-600 mb-2 whitespace-pre-line break-words">{course.description}</div>
                <div className="text-sm text-gray-500">Teacher: {course.teacher?.name || '-'}</div>
                {course.resources && course.resources.length > 0 && (
                  <div className="mt-2">
                    <span className="font-medium">Resources:</span>
                    <ul className="list-disc ml-5 text-gray-700 break-words">
                      {course.resources.map((r, i) => (
                        <li key={i}>
                          {r.url ? (
                            <a href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '')}${r.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{r.filename || r.url}</a>
                          ) : r.filename || r.url}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-2">
                  <div className="flex items-center cursor-pointer" onClick={() => handleExpand('comments-' + course.id)}>
                    {expanded['comments-' + course.id] ? <FaChevronDown className="mr-1" /> : <FaChevronRight className="mr-1" />}
                    <span className="font-medium">Comments</span>
                  </div>
                  {expanded['comments-' + course.id] && (
                    <div className="mt-2">
                      <ul className="list-disc ml-5 text-gray-700 mb-2 break-words">
                        {comments[course.id] && comments[course.id].length ? comments[course.id].map((c, i) => (
                          <li key={i}><span className="font-semibold">{c.user}</span>: {c.text}</li>
                        )) : <li>No comments.</li>}
                      </ul>
                      <form onSubmit={e => { e.preventDefault(); handleCommentSubmit(course.id); }} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <input type="text" placeholder="Add a comment..." value={commentInputs[course.id] || ''} onChange={e => handleCommentChange(course.id, e.target.value)} className="border rounded px-3 py-2 flex-1 min-w-0" />
                        <button type="submit" className="bg-orange text-white px-4 py-2 rounded whitespace-nowrap" disabled={commentLoading[course.id]}>Comment</button>
                      </form>
                      {commentError[course.id] && <div className="text-red-600 text-sm mt-1">{commentError[course.id]}</div>}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )) : <div className="text-gray-500">No courses enrolled.</div>}
      </div>
    </div>
  );
} 