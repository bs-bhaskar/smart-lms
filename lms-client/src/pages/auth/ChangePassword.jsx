import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ChangePassword() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/change-password', {
        userId: user.id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(res.data.message || 'Password changed successfully!');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange mb-6 text-center">Change Password</h2>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Current Password</label>
          <input
            type={showCurrent ? 'text' : 'password'}
            name="currentPassword"
            value={form.currentPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
            required
            placeholder="Enter current password"
            autoFocus
          />
          <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowCurrent(v => !v)}>
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type={showNew ? 'text' : 'password'}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
            required
            placeholder="Enter new password"
          />
          <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowNew(v => !v)}>
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Confirm New Password</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
            required
            placeholder="Confirm new password"
          />
          <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowConfirm(v => !v)}>
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
        <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={loading}>
          {loading ? <Loader /> : 'Change Password'}
        </button>
        <div className="text-center text-sm mt-2">
          <a href="/login" className="text-orange hover:underline">Back to Login</a>
        </div>
      </form>
    </div>
  );
} 