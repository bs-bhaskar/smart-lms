import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/shared/Loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ regNumber: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    // Frontend validation
    if (!form.regNumber && !form.email) {
      setError('Please enter your registration number or email.');
      return;
    }
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      // Redirect based on user role
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'teacher') navigate('/teacher/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError('No user found with these credentials. Please check your registration number/email or contact admin.');
        } else if (err.response.status === 400) {
          setError('Please fill in all required fields.');
        } else if (err.response.status === 401) {
          setError('Incorrect password. Please try again.');
        } else if (err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response.data.message || 'Login failed');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Registration Number</label>
          <input
            type="text"
            name="regNumber"
            value={form.regNumber}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            placeholder="Enter registration number (optional)"
            autoFocus
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
            placeholder="Enter email (optional)"
          />
        </div>
        <div className="mb-4 relative">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange pr-10"
            required
          />
          <span className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        <button type="submit" className="w-full bg-orange text-white font-semibold py-2 rounded hover:bg-orange-dark transition mb-2" disabled={loading}>
          {loading ? <Loader /> : 'Login'}
        </button>
        <div className="flex justify-between text-sm mt-2">
          <a href="/forgot-password" className="text-orange hover:underline">Forgot password?</a>
          <a href="/register" className="text-orange hover:underline">New user? Register</a>
        </div>
      </form>
    </div>
  );
} 