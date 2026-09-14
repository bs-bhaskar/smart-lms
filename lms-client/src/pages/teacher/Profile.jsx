import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function TeacherProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/teacher/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;
  if (!profile) return null;

  return (
    <div className="max-w-md mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">My Profile</h1>
      <div className="mb-4">
        <div className="font-medium">Full Name:</div>
        <div className="text-gray-700 break-words">{profile.name}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium">Email:</div>
        <div className="text-gray-700 break-words">{profile.email}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium">Registration Number:</div>
        <div className="text-gray-700 break-words">{profile.registrationNumber}</div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <a href="/change-password" className="px-4 py-2 bg-orange text-white rounded hover:bg-orange-dark transition text-center">Change Password</a>
        <a href="/teacher/forgot-password" className="px-4 py-2 bg-gray-100 text-orange-700 rounded hover:bg-orange/10 transition text-center border border-orange-200">Forgot Password?</a>
      </div>
      </div>
    </div>
  );
} 