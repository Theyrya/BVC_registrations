import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const MESSAGES_KEY = 'bvc_messages';
const USERS_KEY = 'users';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch (e) { setMessages([]); }

    try {
      const raw = localStorage.getItem(USERS_KEY);
      setUsers(raw ? JSON.parse(raw) : []);
    } catch (e) { setUsers([]); }
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
                <p className="card-text">{m.message}</p>
                <small className="card-meta">From: {m.from} — {new Date(m.timestamp).toLocaleString()}</small>
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
