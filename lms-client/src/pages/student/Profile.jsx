import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentProfile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student/profile', {
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
        <div className="text-gray-700">{profile.name}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium">Email:</div>
        <div className="text-gray-700">{profile.email}</div>
      </div>
      <div className="mb-4">
        <div className="font-medium">Registration Number:</div>
        <div className="text-gray-700">{profile.registrationNumber}</div>
      </div>
      <div className="flex gap-2 mt-4">
        <a href="/change-password" className="w-full sm:w-auto text-center px-4 py-2 bg-orange text-white rounded hover:bg-orange-dark transition">Change Password</a>
      </div>
      </div>
    </div>
  );
} 