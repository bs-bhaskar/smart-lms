import React, { useEffect, useState } from 'react';
import Loader from '../../components/shared/Loader';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function Messenger() {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const fetchMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/teacher/messenger', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data.messages || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [token]);

  const handleSend = async e => {
    e.preventDefault();
    if (!content.trim()) return;
    setSending(true);
    try {
      await api.post('/teacher/messenger', { content }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleEdit = (id, currentContent) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const handleEditSave = async (id) => {
    if (!editContent.trim()) return;
    try {
      await api.put('/teacher/edit-message', { messageId: id, content: editContent }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingId(null);
      setEditContent('');
      fetchMessages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to edit message');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-600 text-center mt-8">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-4 sm:mt-8 px-3 sm:px-4 pb-8">
      <h1 className="text-xl sm:text-2xl font-bold text-orange mb-4 sm:mb-6">Messenger</h1>
      <form onSubmit={handleSend} className="flex flex-col sm:flex-row gap-2 mb-4">
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          className="flex-1 min-w-0 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange"
          placeholder="Type a message to all your students..."
          required
        />
        <button type="submit" className="px-4 py-2 bg-orange text-white rounded hover:bg-orange-dark transition w-full sm:w-auto whitespace-nowrap" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
      <div className="bg-white rounded-xl shadow p-4 sm:p-6">
        <h2 className="font-semibold mb-2">Sent Messages</h2>
        <ul className="list-disc ml-5 text-gray-700">
          {messages.length ? messages.map((m, i) => (
            <li key={i} className="mb-3 break-words">
              {editingId === m._id ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    className="border rounded px-3 py-2 w-full sm:flex-1 min-w-0"
                  />
                  <button className="bg-green-600 text-white px-3 py-2 rounded w-full sm:w-auto" onClick={() => handleEditSave(m._id)}>Save</button>
                  <button className="bg-gray-400 text-white px-3 py-2 rounded w-full sm:w-auto" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <>
                <span className="break-words whitespace-pre-wrap">{m.content}</span> <span className="text-xs text-gray-500">({new Date(m.createdAt).toLocaleString()})</span>
                  <button className="ml-2 mt-1 sm:mt-0 text-blue-600 underline whitespace-nowrap" onClick={() => handleEdit(m._id, m.content)}>Edit</button>
                </>
              )}
            </li>
          )) : <li>No messages sent yet.</li>}
        </ul>
      </div>
    </div>
  );
} 