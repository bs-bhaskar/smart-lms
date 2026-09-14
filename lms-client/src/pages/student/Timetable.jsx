import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

export default function StudentTimetable() {
  const { token } = useAuth();
  const [timetables, setTimetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedTimetables, setExpandedTimetables] = useState({});

  useEffect(() => {
    async function fetchTimetable() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student/timetable', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Student timetable response:', res.data);
        setTimetables(res.data.timetables || []);
      } catch (err) {
        console.error('Student timetable error:', err);
        setError(err.response?.data?.message || 'Failed to load timetable');
      } finally {
        setLoading(false);
      }
    }
    fetchTimetable();
  }, [token]);

  const toggleTimetableExpansion = (timetableId) => {
    setExpandedTimetables(prev => ({
      ...prev,
      [timetableId]: !prev[timetableId]
    }));
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">My Timetable</h1>
      <div className="grid grid-cols-1 gap-6">
        {timetables.length ? timetables.map((t, i) => (
          <div key={i} className="bg-white rounded-xl shadow p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="text-base sm:text-lg font-semibold text-orange mb-1 break-words">{t?.course?.title || '-'}</div>
                <div className="text-gray-600">Teacher: {t?.teacher?.name || '-'}</div>
              </div>
              <div 
                className="flex items-center cursor-pointer text-orange font-medium self-start sm:self-auto whitespace-nowrap"
                onClick={() => toggleTimetableExpansion(i)}
              >
                {expandedTimetables[i] ? <FaChevronDown className="mr-2" /> : <FaChevronRight className="mr-2" />}
                {expandedTimetables[i] ? 'Hide' : 'Show'} Schedule
              </div>
            </div>
            
            {expandedTimetables[i] && (
              <div className="mt-4">
                {t.schedule && t.schedule.length > 0 ? (
                  t.schedule.map((slot, slotIndex) => (
                    <div key={slotIndex} className="bg-orange/5 rounded-lg p-3 sm:p-4 mb-3 last:mb-0 break-words">
                      <div className="text-gray-700 mb-1"><span className="font-medium">Day:</span> {slot.day || '-'}</div>
                      <div className="text-gray-700 mb-1"><span className="font-medium">Time:</span> {slot.startTime || '-'} - {slot.endTime || '-'}</div>
                      {slot.notes && (
                        <div className="text-gray-600 text-sm"><span className="font-medium">Notes:</span> {slot.notes}</div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No schedule defined for this course.</div>
                )}
              </div>
            )}
          </div>
        )) : (
          <div className="text-center text-gray-500">
            <div className="text-lg mb-2">No timetable found.</div>
            <div className="text-sm">You may not be enrolled in any courses yet, or no timetables have been assigned.</div>
          </div>
        )}
      </div>
    </div>
  );
} 