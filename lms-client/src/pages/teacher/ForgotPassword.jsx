import React, { useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function TeacherForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/teacher/forgot-password', { email });
      setSuccess(res.data.message || 'OTP sent to your email!');
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.post('/teacher/verify-otp', { email, otp });
      setSuccess(res.data.message || 'OTP verified!');
      setTimeout(() => navigate('/reset-password', { state: { email, role: 'teacher' } }), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100 px-3 sm:px-4">
      <form onSubmit={otpSent ? handleOtpVerify : handleSubmit} className="bg-white shadow-lg rounded-xl p-5 sm:p-8 w-full max-w-md">
        <h2 className="text-xl sm:text-2xl font-bold text-orange mb-5 sm:mb-6 text-center">Teacher Forgot Password</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Registered Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            required
            autoFocus
            disabled={otpSent}
          />
        </div>
        {otpSent && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Enter OTP</label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
              required
              pattern="\d{6}"
              placeholder="Enter the 6-digit OTP"
            />
          </div>
        )}
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-3">{success}</div>}
        <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={loading}>
          {loading ? <Loader /> : (otpSent ? 'Verify OTP' : 'Send OTP')}
        </button>
        <div className="text-center text-sm mt-2">
          <a href="/teacher/login" className="text-orange hover:underline">Back to Login</a>
        </div>
      </form>
    </div>
  );
} 