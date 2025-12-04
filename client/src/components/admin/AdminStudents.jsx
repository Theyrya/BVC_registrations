import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('');

  const loadUsers = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (!token) return;
      const resp = await fetch('http://localhost:5000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      if (resp.ok) {
        const data = await resp.json();
        setUsers(data);
      }
    } catch (e) {
      console.error('Failed to load users', e);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const handleRemove = async (id) => {
    if (!confirm('Remove this student?')) return;
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (!token) return alert('Not authenticated');
      const resp = await fetch(`http://localhost:5000/api/admin/users/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Failed to delete');
      // refresh list
      await loadUsers();
    } catch (e) {
      console.error(e);
      alert('Failed to remove user');
    }
  };

  // fallback: use localStorage if API fails or token missing
  useEffect(() => {
    if (!users || users.length === 0) {
      try {
        const raw = localStorage.getItem('users');
        if (raw) setUsers(JSON.parse(raw));
      } catch (e) {}
    }
  }, [users]);

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
                  <button className="btn btn-danger" onClick={() => handleRemove(u.id)}>Remove</button>
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
