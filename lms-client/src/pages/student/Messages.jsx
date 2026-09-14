import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function StudentMessages() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/student/messages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, [token]);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Messages from Teachers</h1>
      <div className="flex flex-col gap-4">
        {messages.length ? messages.map(m => (
          <div key={m.id} className="bg-white rounded-xl shadow p-4 break-words overflow-hidden">
            <div className="font-semibold text-orange mb-1">{m.sender}</div>
            <div className="text-gray-800 mb-2 break-words whitespace-pre-wrap">{m.content}</div>
            <div className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleString()}</div>
          </div>
        )) : <div className="text-gray-500">No messages yet.</div>}
      </div>
    </div>
  );
} 