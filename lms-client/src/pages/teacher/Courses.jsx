import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function TeacherCourses() {
  const { token } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState({});
  const [uploadError, setUploadError] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState({});
  const [fileInputs, setFileInputs] = useState({});
  const [linkInputs, setLinkInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [commentError, setCommentError] = useState({});
  const [expanded, setExpanded] = useState({});
  const [comments, setComments] = useState({});

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); /* eslint-disable-next-line */ }, [token]);

  // File upload handler
  const handleFileChange = (courseId, file) => {
    setFileInputs(f => ({ ...f, [courseId]: file }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));
  };
  const handleFileUpload = async (courseId) => {
    if (!fileInputs[courseId]) return;
    setUploading(u => ({ ...u, [courseId]: true }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));
    try {
      const formData = new FormData();
      formData.append('file', fileInputs[courseId]);
      formData.append('courseId', courseId);
      await api.post('/teacher/upload-resource', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadSuccess(s => ({ ...s, [courseId]: 'File uploaded!' }));
      setFileInputs(f => ({ ...f, [courseId]: null }));
      fetchCourses();
    } catch (err) {
      setUploadError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Upload failed' }));
    } finally {
      setUploading(u => ({ ...u, [courseId]: false }));
    }
  };
  // Link upload handler (as a resource entry)
  const handleLinkChange = (courseId, value) => {
    setLinkInputs(l => ({ ...l, [courseId]: value }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));
  };
  const handleLinkUpload = async (courseId) => {
    if (!linkInputs[courseId]) return;
    setUploading(u => ({ ...u, [courseId]: true }));
    setUploadError(e => ({ ...e, [courseId]: '' }));
    setUploadSuccess(s => ({ ...s, [courseId]: '' }));
    try {
      // Save link as a resource (simulate file upload with a link resource)
      await api.put(`/teacher/courses/${courseId}`, { courseId, link: linkInputs[courseId] }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadSuccess(s => ({ ...s, [courseId]: 'Link added!' }));
      setLinkInputs(l => ({ ...l, [courseId]: '' }));
      fetchCourses();
    } catch (err) {
      setUploadError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Failed to add link' }));
    } finally {
      setUploading(u => ({ ...u, [courseId]: false }));
    }
  };
  // Comment handler
  const handleCommentChange = (courseId, value) => {
    setCommentInputs(c => ({ ...c, [courseId]: value }));
    setCommentError(e => ({ ...e, [courseId]: '' }));
  };
  const handleCommentSubmit = async (courseId) => {
    if (!commentInputs[courseId]) return;
    setCommentLoading(l => ({ ...l, [courseId]: true }));
    setCommentError(e => ({ ...e, [courseId]: '' }));
    try {
      await api.post('/teacher/add-comment', { courseId, text: commentInputs[courseId] }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCommentInputs(c => ({ ...c, [courseId]: '' }));
      fetchCourses();
    } catch (err) {
      setCommentError(e => ({ ...e, [courseId]: err.response?.data?.message || 'Failed to add comment' }));
    } finally {
      setCommentLoading(l => ({ ...l, [courseId]: false }));
    }
  };

  const handleExpand = async (courseId) => {
    setExpanded(e => ({ ...e, [courseId]: !e[courseId] }));
    if (!comments[courseId]) {
      try {
        const res = await api.get(`/student/courses/${courseId}/comments`, { headers: { Authorization: `Bearer ${token}` } });
        setComments(c => ({ ...c, [courseId]: res.data.comments }));
      } catch {}
    }
  };

  // Get backend base URL for serving uploaded files
  const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">My Courses</h1>
      <div className="grid gap-6">
        {courses.length ? courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl shadow p-4 sm:p-6 overflow-hidden break-words">
            <div className="flex items-start sm:items-center cursor-pointer min-w-0" onClick={() => handleExpand(course.id)}>
              {expanded[course.id] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
              <h2 className="font-semibold text-base sm:text-lg mb-1 break-words min-w-0">{course.title}</h2>
            </div>
            {expanded[course.id] && (
              <>
                <div className="text-gray-600 mb-2 break-words whitespace-pre-wrap">{course.description}</div>
                <div className="text-sm text-gray-500 mb-2">Students: {course.students?.length || 0}</div>
                {/* Resource upload */}
                <div className="mb-3 flex flex-col gap-3 items-stretch">
                  <form onSubmit={e => { e.preventDefault(); handleFileUpload(course.id); }} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input type="file" onChange={e => handleFileChange(course.id, e.target.files[0])} className="border rounded px-2 py-2 w-full min-w-0" />
                    <button type="submit" className="bg-orange text-white px-3 py-2 rounded w-full sm:w-auto whitespace-nowrap" disabled={uploading[course.id]}>Upload File</button>
                  </form>
                  <form onSubmit={e => { e.preventDefault(); handleLinkUpload(course.id); }} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                    <input type="url" placeholder="Add resource link" value={linkInputs[course.id] || ''} onChange={e => handleLinkChange(course.id, e.target.value)} className="border rounded px-3 py-2 flex-1 min-w-0" />
                    <button type="submit" className="bg-orange text-white px-3 py-2 rounded w-full sm:w-auto whitespace-nowrap" disabled={uploading[course.id]}>Add Link</button>
                  </form>
                </div>
                {(uploadError[course.id] || uploadSuccess[course.id]) && (
                  <div className="mb-2 text-sm">
                    {uploadError[course.id] && <span className="text-red-600">{uploadError[course.id]}</span>}
                    {uploadSuccess[course.id] && <span className="text-green-600">{uploadSuccess[course.id]}</span>}
                  </div>
                )}
                <div className="mb-2">
                  <span className="font-medium">Resources:</span>
                  <ul className="list-disc ml-5 text-gray-700 break-words">
                    {course.resources && course.resources.length ? course.resources.map((r, i) => (
                      <li key={i} className="break-words">
                        {r.url ? (
                          <a href={`${backendBase}${r.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{r.filename || r.url}</a>
                        ) : r.filename || r.url}
                      </li>
                    )) : <li>No resources.</li>}
                  </ul>
                </div>
                <div className="mt-2">
                  <div className="flex items-center cursor-pointer" onClick={() => handleExpand('comments-' + course.id)}>
                    {expanded['comments-' + course.id] ? <FaChevronDown className="mr-1" /> : <FaChevronRight className="mr-1" />}
                    <span className="font-medium">Comments</span>
                  </div>
                  {expanded['comments-' + course.id] && (
                    <div className="mt-2">
                      <ul className="list-disc ml-5 text-gray-700 mb-2 break-words">
                        {comments[course.id] && comments[course.id].length ? comments[course.id].map((c, i) => (
                          <li key={i} className="break-words"><span className="font-semibold">{c.user}</span>: {c.text}</li>
                        )) : <li>No comments.</li>}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )) : <div className="text-gray-500">No courses assigned.</div>}
      </div>
    </div>
  );
} 