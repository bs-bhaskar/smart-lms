import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ResetPassword() {
  const [form, setForm] = useState({ regNumber: '', otp: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/auth/reset-password', form);
      setSuccess(res.data.message || 'Password reset successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange mb-6 text-center">Reset Password</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Registration Number</label>
          <input
            type="text"
            name="regNumber"
            value={form.regNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            required
            pattern="\d{6}"
            placeholder="Enter your 6-digit reg. number"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">OTP</label>
          <input
            type="text"
            name="otp"
            value={form.otp}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            required
            pattern="\d{6}"
            placeholder="Enter the 6-digit OTP"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">New Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="newPassword"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
            required
            placeholder="Enter new password"
          />
          <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Confirm Password</label>
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
          {loading ? <Loader /> : 'Reset Password'}
        </button>
        <div className="text-center text-sm mt-2">
          <a href="/login" className="text-orange hover:underline">Back to Login</a>
        </div>
      </form>
    </div>
  );
} 