import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { QRCodeCanvas } from 'qrcode.react';

export default function StudentDashboard() {
  const { token, user } = useAuth();
  const parentReportUrl = user?.id? `${window.location.origin}/parent-report/${user.id}` : '';

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [performance, setPerformance] = useState(null);
  const [performanceLoading, setPerformanceLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError('');

      try {
        const [dashboardRes, performanceRes] = await Promise.all([
          api.get('/student/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          api.get('/teacher/performance', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        setData(dashboardRes.data || {});
        setPerformance(performanceRes.data || {});
      } catch (err) {
        console.error('Dashboard error:', err);
        setError(
          err?.response?.data?.message ||
          'Failed to load dashboard'
        );
      } finally {
        setLoading(false);
        setPerformanceLoading(false);
      }
    }

    if (token) {
      fetchDashboard();
    }
  }, [token]);

  // Filter today's classes
  const getTodayClasses = () => {
    if (!data || !Array.isArray(data.timetables)) return [];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return data.timetables.filter(t =>
      Array.isArray(t.schedule) && t.schedule.some(slot => slot && slot.day === today)
    );
  };

  const todayClasses = getTodayClasses();

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!data) return null;

  return (
    <div className="relative max-w-6xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-24">
      {/* Study Bot - Fixed in corner */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <a 
          href="/student/studybot" 
          className="bg-orange text-white rounded-full p-3 sm:p-4 shadow-lg hover:bg-orange-dark transition-all duration-300 transform hover:scale-110 flex flex-col items-center"
          title="Study Bot - Save notes and reminders"
        >
          <div className="text-xl sm:text-2xl mb-1">🤖</div>
          <div className="text-xs font-medium">Study Bot</div>
        </a>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Student Dashboard</h1>

            {/* Parent QR */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">

          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-semibold text-orange mb-2">
              Parent Access
            </h2>

            <p className="text-gray-600 text-sm sm:text-base">
              Scan this QR code to view your student details and academic performance.
            </p>
          </div>

          {parentReportUrl && (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-white border rounded-lg">
                <QRCodeCanvas
                  value={parentReportUrl}
                  size={180}
                  level="M"
                />
              </div>

              <p className="text-xs text-gray-500">
                Scan to view report
              </p>
            </div>
          )}

        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-orange">
              📊 My Performance
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Track your academic performance and test progress.
            </p>
          </div>
        </div>

        {performanceLoading ? (
          <div className="py-8 text-center text-gray-500">
            Loading performance...
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

              <div className="border rounded-lg p-4 bg-orange/5">
                <p className="text-xs sm:text-sm text-gray-500">
                  Average Score
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-orange mt-1">
                  {performance?.summary?.averagePercentage ?? 0}%
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="text-xs sm:text-sm text-gray-500">
                  Tests Taken
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                  {performance?.summary?.testsTaken ?? 0}
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-green-50">
                <p className="text-xs sm:text-sm text-gray-500">
                  Highest Score
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                  {performance?.summary?.bestPercentage ?? 0}%
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-red-50">
                <p className="text-xs sm:text-sm text-gray-500">
                  Lowest Score
                </p>

                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                  {performance?.summary?.lowestPercentage ?? 0}%
                </p>
              </div>

            </div>

            {/* Course Performance */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Course-wise Performance
              </h3>

              {performance?.coursePerformance?.length > 0 ? (
                <div className="space-y-4">

                  {performance.coursePerformance.map((course) => (
                    <div key={course.courseId}>

                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          {course.course}
                        </span>

                        <span className="text-sm font-semibold text-orange">
                          {course.averagePercentage}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-orange h-2.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              course.averagePercentage,
                              100
                            )}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {course.tests} test
                        {course.tests !== 1 ? 's' : ''} completed
                      </p>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center py-5 text-gray-500">
                  No graded tests available yet.
                </div>
              )}
            </div>

            {/* Performance Trend */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                Performance Trend
              </h3>

              {performance?.trend?.length > 0 ? (
                <div className="space-y-3">

                  {performance.trend.map((item, index) => (
                    <div
                      key={`${item.test}-${index}`}
                      className="flex items-center gap-3"
                    >

                      <div className="w-8 text-xs text-gray-500">
                        #{index + 1}
                      </div>

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {item.test}
                          </span>

                          <span className="text-sm font-semibold text-gray-800">
                            {item.percentage}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange h-2 rounded-full"
                            style={{
                              width: `${Math.min(
                                item.percentage,
                                100
                              )}%`,
                            }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>
                            {item.course}
                          </span>

                          <span>
                            {item.date
                              ? new Date(item.date).toLocaleDateString()
                              : ''}
                          </span>
                        </div>

                      </div>

                    </div>
                  ))}

                </div>
              ) : (
                <div className="text-center py-5 text-gray-500">
                  No performance trend available yet.
                </div>
              )}
            </div>

          </>
        )}
      </div>
      
      {/* Activities/Notifications Section */}
      <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6">
        <div className="flex items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="font-semibold text-base sm:text-lg text-orange">Recent Activities & Updates</h2>
          <div className="bg-orange text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
            {Array.isArray(data.activities) ? data.activities.length : 0} new
          </div>
        </div>
        
        <div className="space-y-4">
          {Array.isArray(data.activities) && data.activities.length > 0 ? (
            data.activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-orange/5 rounded-lg border-l-4 border-orange">
                <div className="text-orange text-lg">
                  {activity.type === 'resource' && '📚'}
                  {activity.type === 'announcement' && '📢'}
                  {activity.type === 'assignment' && '📝'}
                  {activity.type === 'grade' && '📊'}
                  {!activity.type && '🔔'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{activity.title || 'New Update'}</div>
                  <div className="text-sm text-gray-600">{activity.message || activity.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {activity.course && `Course: ${activity.course}`}
                    {activity.teacher && ` • Teacher: ${activity.teacher}`}
                    {activity.timestamp && ` • ${new Date(activity.timestamp).toLocaleDateString()}`}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              <div className="text-lg mb-2">No recent activities</div>
              <div className="text-sm">Updates from teachers will appear here</div>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h2 className="font-semibold mb-2">Enrolled Courses</h2>
          <ul className="list-disc ml-5 text-gray-700">
            {Array.isArray(data.courses) && data.courses.length ? data.courses.map(c => (
              <li key={c.id || c._id}>{c.title} <span className="text-xs text-gray-500">({c.teacher?.name || 'Unknown'})</span></li>
            )) : <li>No courses enrolled.</li>}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-4 sm:p-6">
          <h2 className="font-semibold mb-2">Resources</h2>
          <ul className="list-disc ml-5 text-gray-700">
            {Array.isArray(data.resources) && data.resources.length ? data.resources.map((r, i) => (
              <li key={r.id || r._id || i}>{r.filename} <span className="text-xs text-gray-500">({r.course || 'General'})</span></li>
            )) : <li>No resources available.</li>}
          </ul>
        </div>
      </div>

      {/* Today's Classes Section */}
      <div className="bg-white rounded-xl shadow p-6 mt-6">
        <h2 className="font-semibold mb-4 text-orange">Today's Classes</h2>
        {todayClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {todayClasses.map((t, i) => (
              <div key={t._id || i} className="bg-orange/5 rounded-lg p-4 border border-orange/20">
                <div className="text-lg font-semibold text-orange mb-2">{t?.course?.title || 'Unknown Course'}</div>
                <div className="text-gray-700 mb-1">
                  <span className="font-medium">Teacher:</span> {t?.teacher?.name || 'Unknown'}
                </div>
                {Array.isArray(t.schedule) && t.schedule.filter(slot => {
                  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                  return slot && slot.day === today;
                }).map((slot, slotIndex) => (
                  <div key={slotIndex} className="text-gray-700">
                    <div><span className="font-medium">Time:</span> {slot.startTime || '-'} - {slot.endTime || '-'}</div>
                    {slot.notes && (
                      <div className="text-gray-600 text-sm mt-1">
                        <span className="font-medium">Notes:</span> {slot.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-2">No classes scheduled for today</div>
            <div className="text-gray-400 text-sm">Enjoy your free time! 📚</div>
          </div>
        )}
      </div>
    </div>
  );
} 