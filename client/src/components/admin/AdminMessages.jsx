import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const MESSAGES_KEY = 'bvc_messages';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setMessages([]);
    }
  }, []);

  const handleRemove = (id) => {
    if (!confirm('Remove this message?')) return;
    const next = messages.filter(m => m.id !== id);
    setMessages(next);
    try { localStorage.setItem(MESSAGES_KEY, JSON.stringify(next)); } catch (e) { console.error(e); }
  };

  const handleClearAll = () => {
    if (!confirm('Clear all messages?')) return;
    setMessages([]);
    try { localStorage.removeItem(MESSAGES_KEY); } catch (e) { console.error(e); }
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
                <p className="card-text">{m.message}</p>
                <small className="card-meta">From: {m.from} — {new Date(m.timestamp).toLocaleString()}</small>
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
