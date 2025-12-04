import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (token) {
        const resp = await fetch('http://localhost:5000/api/messages', { headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          const data = await resp.json();
          setMessages(data || []);
        }
      }
    } catch (e) {
      console.error('Failed to fetch messages from API', e);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRemove = async (id) => {
    if (!window.confirm('Remove this message?')) return;
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (token) {
        const resp = await fetch(`http://localhost:5000/api/messages/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          setMessages(prev => prev.filter(m => m.id !== id));
        }
      }
    } catch (e) {
      console.error('Failed to delete message via API', e);
      alert('Failed to delete message');
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all messages?')) return;
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (token) {
        const resp = await fetch('http://localhost:5000/api/messages', { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
        if (resp.ok) {
          setMessages([]);
        }
      }
    } catch (e) {
      console.error('Failed to clear messages via API', e);
      alert('Failed to clear messages');
    }
  };

  return (
    <div className="admin-container">
      <h3 className="admin-title">Messages</h3>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Messages: {messages.length}</div>
          <div>
            <button className="btn" onClick={handleClearAll} disabled={messages.length === 0}>Clear All</button>
          </div>
        </div>

        {messages.length === 0 ? (
          <p className="muted">No messages submitted yet.</p>
        ) : (
          messages.map(m => (
            <article key={m.id} className="card">
              <div className="card-body">
                <strong className="card-subject">{m.subject}</strong>
                <p className="card-text">{m.body || m.message}</p>
                <small className="card-meta">From: {m.fromName || m.name || m.from || m.email || 'Student'} — {new Date(m.createdAt || m.timestamp || Date.now()).toLocaleString()}</small>
                <div style={{ marginTop: 8 }}>
                  <button className="btn btn-danger" onClick={() => handleRemove(m.id)}>Remove</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
