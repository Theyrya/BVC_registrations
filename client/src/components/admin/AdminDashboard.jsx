import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchData = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      // fetch messages
      if (token) {
        const mResp = await fetch('http://localhost:5000/api/messages', { headers: { Authorization: `Bearer ${token}` } });
        if (mResp.ok) setMessages(await mResp.json());
        const uResp = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
        if (uResp.ok) setUsers(await uResp.json());
      }
    } catch (e) {
      console.error('Failed to load admin data', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Methods moved to AdminCourses.jsx

  return (
    <div className="admin-container">
      <h3 className="admin-title">Admin Dashboard</h3>

      <div className="admin-grid">
        <section className="panel">
          <h4>Messages</h4>
          {messages.length === 0 ? (
            <p className="muted">No messages submitted yet.</p>
          ) : messages.map(m => (
            <article key={m.id} className="card">
              <div className="card-body">
                <strong className="card-subject">{m.subject}</strong>
                <p className="card-text">{m.body || m.message}</p>
                <small className="card-meta">From: {m.fromName || m.name || m.from || m.email || 'Student'} — {new Date(m.createdAt || m.timestamp || m.createdAt || Date.now()).toLocaleString()}</small>
              </div>
            </article>
          ))}
        </section>

        {/* Student registrations removed from dashboard to keep Manage Courses focused */}

        <section className="panel">
          <h4>Registered Students</h4>
          {users.length === 0 ? (
            <p className="muted">No students have signed up yet.</p>
          ) : users.map(u => (
            <article key={u.username || u.studentId || u.email} className="card">
              <div className="card-body">
                <strong className="card-subject">{u.firstName} {u.lastName} {u.studentId ? `— ${u.studentId}` : ''}</strong>
                <p className="card-text">Program: {u.program || 'N/A'} — Department: {u.department || 'N/A'}</p>
                <p className="card-text">Email: {u.email} — Phone: {u.phone}</p>
                <small className="card-meta">Username: {u.username}</small>
              </div>
            </article>
          ))}
        </section>
      </div>

      {/* Course management moved to AdminCourses.jsx */}
    </div>
  );
};

export default AdminDashboard;
