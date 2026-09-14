import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/shared/Loader';

export default function ParentReport() {
  const { studentId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchReport() {
      try {
        setLoading(true);
        setError('');

        const res = await api.get(`/student/parent-report/${studentId}`);

        setData(res.data);
      } catch (err) {
        console.error('Parent report error:', err);
        setError(
          err?.response?.data?.message || 'Failed to load student report'
        );
      } finally {
        setLoading(false);
      }
    }

    if (studentId) {
      fetchReport();
    }
  }, [studentId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Unable to Load Report
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const {
    student,
    courses = [],
    results = [],
    performance = {}
  } = data;

  const {
    averagePercentage = 0,
    testsTaken = 0,
    highestPercentage = 0,
    lowestPercentage = 0,
    passRate = 0,
    coursePerformance = [],
    trend = []
  } = performance;

  return (
    <div className="max-w-5xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">

      {/* Header */}
      <div className="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-orange mb-2">
          Student Report
        </h1>

        <p className="text-gray-500">
          Student information and academic performance
        </p>
      </div>

      {/* Student Details */}
      <div className="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-orange mb-4">
          Student Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-semibold text-gray-800 break-words">
              {student?.name || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Registration Number</p>
            <p className="font-semibold text-gray-800">
              {student?.registrationNumber || '-'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-semibold text-gray-800 break-all">
              {student?.email || '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">

        <div className="mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-orange">
            📊 Performance Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overall academic performance of the student
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

          <div className="border rounded-lg p-4 bg-orange/5">
            <p className="text-xs sm:text-sm text-gray-500">
              Average Score
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-orange mt-1">
              {averagePercentage}%
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50">
            <p className="text-xs sm:text-sm text-gray-500">
              Tests Taken
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
              {testsTaken}
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-green-50">
            <p className="text-xs sm:text-sm text-gray-500">
              Highest Score
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
              {highestPercentage}%
            </p>
          </div>

          <div className="border rounded-lg p-4 bg-purple-50">
            <p className="text-xs sm:text-sm text-gray-500">
              Pass Rate
            </p>

            <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
              {passRate}%
            </p>
          </div>

        </div>

        {/* Course Performance */}
        <div className="mt-6">

          <h3 className="font-semibold text-gray-800 mb-4">
            Course-wise Performance
          </h3>

          {coursePerformance.length > 0 ? (
            <div className="space-y-4">

              {coursePerformance.map((course) => (
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
                      className="bg-orange h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(
                          course.averagePercentage,
                          100
                        )}%`
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
            <p className="text-gray-500">
              No graded tests available yet.
            </p>
          )}

        </div>

        {/* Performance Trend */}
        <div className="mt-6">

          <h3 className="font-semibold text-gray-800 mb-4">
            Performance Trend
          </h3>

          {trend.length > 0 ? (
            <div className="space-y-3">

              {trend.map((item, index) => (
                <div
                  key={`${item.test}-${index}`}
                  className="flex items-center gap-3"
                >

                  <span className="text-xs text-gray-400 w-7">
                    #{index + 1}
                  </span>

                  <div className="flex-1">

                    <div className="flex justify-between gap-2 mb-1">

                      <span className="text-sm font-medium text-gray-700 truncate">
                        {item.test}
                      </span>

                      <span className="text-sm font-semibold">
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
                          )}%`
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
            <p className="text-gray-500">
              No performance trend available yet.
            </p>
          )}

        </div>

      </div>

      {/* Courses */}
      <div className="bg-white rounded-xl shadow p-5 sm:p-6 mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-orange mb-4">
          Enrolled Courses
        </h2>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-800">
                  {course.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line break-words">
                  {course.description || 'No description available'}
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  <span className="font-medium">Teacher:</span>{' '}
                  {course.teacher?.name || 'Unknown'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No courses enrolled.
          </p>
        )}
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl shadow p-5 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-orange mb-4">
          Test Results
        </h2>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3">Test</th>
                  <th className="text-left p-3">Course</th>
                  <th className="text-left p-3">Marks</th>
                  <th className="text-left p-3">Percentage</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-3">
                      {result.testTitle}
                    </td>

                    <td className="p-3">
                      {result.course}
                    </td>

                    <td className="p-3">
                      {result.totalMarks ?? 0} / {result.maxMarks ?? 0}
                    </td>

                    <td className="p-3">
                      {result.percentage ?? 0}%
                    </td>

                    <td className="p-3">
                      {result.graded ? (
                        <span className="text-green-600 font-medium">
                          Graded
                        </span>
                      ) : (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">
            No test results available.
          </p>
        )}
      </div>

    </div>
  );
}