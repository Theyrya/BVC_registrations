import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const USERS_KEY = 'users';

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      setUsers(raw ? JSON.parse(raw) : []);
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const handleRemove = (username) => {
    if (!confirm('Remove this student?')) return;
    const next = users.filter(u => u.username !== username);
    setUsers(next);
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
    } catch (e) {
      console.error('Failed to update users in localStorage', e);
    }
  };

  const filtered = users.filter(u => {
    const q = filter.trim().toLowerCase();
    if (!q) return true;
    return (
      (u.firstName || '').toLowerCase().includes(q) ||
      (u.lastName || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.username || '').toLowerCase().includes(q) ||
      (u.studentId || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="admin-container">
      <h3 className="admin-title">Registered Students</h3>

      <div className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>Showing: {filtered.length} / {users.length}</div>
          <input
            placeholder="Search students by name, email, username, or id"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ padding: '6px 8px', width: '320px' }}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="muted">No students found.</p>
        ) : (
          filtered.map(u => (
            <article key={u.username || u.studentId || u.email} className="card">
              <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong className="card-subject">{u.firstName} {u.lastName} {u.studentId ? `— ${u.studentId}` : ''}</strong>
                  <p className="card-text">Program: {u.program || 'N/A'} — Department: {u.department || 'N/A'}</p>
                  <p className="card-text">Email: {u.email} — Phone: {u.phone}</p>
                  <small className="card-meta">Username: {u.username}</small>
                </div>
                <div>
                  <button className="btn btn-danger" onClick={() => handleRemove(u.username)}>Remove</button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminStudents;
