// src/components/admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { courses as defaultCourses, students } from '../../data/mockData';
import './adminDashboard.css';

const MESSAGES_KEY = 'bvc_messages';
const REG_KEY = 'bvc_registrations';
const CUSTOM_COURSES_KEY = 'bvc_custom_courses';

const AdminDashboard = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'messages';

  const [messages, setMessages] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [customCourses, setCustomCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', term: 'Winter', credits: 3 });
  const [courseSearch, setCourseSearch] = useState('');
  const [courseTerm, setCourseTerm] = useState('All');

  // Load data once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch { setMessages([]); }

    try {
      const raw = localStorage.getItem(REG_KEY);
      setRegistrations(raw ? JSON.parse(raw) : {});
    } catch { setRegistrations({}); }

    try {
      const raw = localStorage.getItem(CUSTOM_COURSES_KEY);
      setCustomCourses(raw ? JSON.parse(raw) : []);
    } catch { setCustomCourses([]); }
  }, []);

  const saveCustom = (next) => {
    setCustomCourses(next);
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(next));
  };

  const handleAddCourse = () => {
    if (!newCourse.code.trim() || !newCourse.name.trim()) return;
    const course = { id: Date.now(), ...newCourse };
    const next = [...customCourses, course];
    saveCustom(next);
    setNewCourse({ code: '', name: '', term: 'Winter', credits: 3 });
  };

  const handleRemoveCustom = (id) => {
    const next = customCourses.filter(c => c.id !== id);
    saveCustom(next);
  };

  const allCourses = [...defaultCourses, ...customCourses];

  return (
    <div className="admin-container">
      <h2 className="admin-title">Admin Dashboard</h2>

      {/* Simple in-page tabs driven by query string */}
      {/* <div className="panel">
        <div className="tab-links">
          <Link className={`tab-link ${tab === 'messages' ? 'active' : ''}`} to="/admin/dashboard?tab=messages">
            Messages
          </Link>
          <Link className={`tab-link ${tab === 'courses' ? 'active' : ''}`} to="/admin/dashboard?tab=courses">
            Manage Courses
          </Link>
          <Link className={`tab-link ${tab === 'students' ? 'active' : ''}`} to="/admin/dashboard?tab=students">
            View Students
          </Link>
        </div>
      </div> */}

      {/* MESSAGES */}
      {tab === 'messages' && (
        <div className="panel">
          <h3>Messages</h3>
          {messages.length === 0 ? (
            <p className="muted">No messages submitted yet.</p>
          ) : (
            messages.map(m => (
              <div key={m.id} className="card">
                <div className="card-body">
                  <strong className="card-subject">{m.subject}</strong>
                  <p className="card-text">{m.message}</p>
                  <span className="card-meta">
                    From: {m.from} — {new Date(m.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      
      {/* MANAGE COURSES */}
      {tab === 'courses' && (
        <div className="panel">
          <h3>Manage Custom Courses</h3>

          {/* Add custom course row */}
          <div className="form-row">
            <input
              className="tiny-input"
              placeholder="Code"
              value={newCourse.code}
              onChange={e => setNewCourse(p => ({ ...p, code: e.target.value }))}
            />
            <input
              className="flex-input"
              placeholder="Name"
              value={newCourse.name}
              onChange={e => setNewCourse(p => ({ ...p, name: e.target.value }))}
            />
            <select
              className="small-input"
              value={newCourse.term}
              onChange={e => setNewCourse(p => ({ ...p, term: e.target.value }))}
            >
              <option>Winter</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Fall</option>
            </select>
            <input
              className="tiny-input"
              type="number"
              min={1}
              max={6}
              value={newCourse.credits}
              onChange={e => setNewCourse(p => ({ ...p, credits: Number(e.target.value) }))}
            />
            <button className="btn btn-primary" onClick={handleAddCourse}>Add</button>
          </div>

          {/* Custom courses list (editable) */}
          {customCourses.length === 0 ? (
            <p className="muted">No custom courses added.</p>
          ) : (
            customCourses.map(c => (
              <div key={c.id} className="course-card">
                <div>
                  <div className="course-title">{c.code} — {c.name}</div>
                  <div className="course-meta">Term: {c.term} — Credits: {c.credits}</div>
                </div>
                
                <div style={{ display: 'flex', gap: 8 }}>
                <Link className="btn btn-primary" to={`/admin/courses/${encodeURIComponent(c.id ?? c.code)}`}>
                  View
                </Link>
                <button className="btn btn-danger" onClick={() => handleRemoveCustom(c.id)}>
                  Remove
                </button>
              </div>

              </div>
            ))
          )}

          {/* ---- Divider / All courses catalog ---- */}
        <div className="panel full" style={{ marginTop: 16 }}>
          <h3>All Available Courses</h3>

          {/* Filters */}
          <div className="form-row" style={{ marginBottom: 8 }}>
            <input
              className="flex-input"
              placeholder="Search by code or name..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
            />
            <select
              className="small-input"
              value={courseTerm}
              onChange={(e) => setCourseTerm(e.target.value)}
            >
              <option>All</option>
              <option>Winter</option>
              <option>Spring</option>
              <option>Summer</option>
              <option>Fall</option>
            </select>
          </div>

          {/* Catalog grid */}
          <div className="courses-grid">
            {([...defaultCourses, ...customCourses]
              .filter(c => {
                const q = courseSearch.trim().toLowerCase();
                const matchesQuery = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
                const matchesTerm = courseTerm === 'All' || String(c.term).toLowerCase() === courseTerm.toLowerCase();
                return matchesQuery && matchesTerm;
              })
              .map(c => (
                
                <div key={`catalog-${c.id ?? c.code}`} className="course-card">
                  <div>
                    <div className="course-title">{c.code} — {c.name}</div>
                    <div className="course-meta">
                      Term: {c.term}{c.credits != null ? ` — Credits: ${c.credits}` : ''}
                    </div>
                  </div>
                  <Link className="btn btn-primary" to={`/admin/courses/${encodeURIComponent(c.id ?? c.code)}`}>
                    View
                  </Link>
                </div>

              )))}
          </div>

          {/* Empty state if no matches */}
          {([...defaultCourses, ...customCourses]
            .filter(c => {
              const q = courseSearch.trim().toLowerCase();
              const matchesQuery = !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q);
              const matchesTerm = courseTerm === 'All' || String(c.term).toLowerCase() === courseTerm.toLowerCase();
              return matchesQuery && matchesTerm;
            }).length === 0) && (
            <p className="muted" style={{ marginTop: 8 }}>No courses match your filters.</p>
          )}
        </div>
      </div>
    )}

      
      {/* VIEW STUDENTS (list from mock data) */}
      {tab === 'students' && (
        <div className="panel">
          <h3>Students</h3>
          {students.length === 0 ? (
            <p className="muted">No students found in mock data.</p>
          ) : (
            <div className="card">
              <div className="card-body">
                {students.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    <div>
                      <strong>{s.firstName} {s.lastName}</strong> — {s.studentId}
                      <div className="muted">{s.program} • {s.department}</div>
                    </div>
                    <Link className="btn btn-primary" to={`/admin/students/${encodeURIComponent(s.id)}`}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
