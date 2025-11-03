import React, { useEffect, useState } from 'react';
import { courses as defaultCourses } from '../../data/mockData';
import './adminDashboard.css';

const MESSAGES_KEY = 'bvc_messages';
const REG_KEY = 'bvc_registrations';
const CUSTOM_COURSES_KEY = 'bvc_custom_courses';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [customCourses, setCustomCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', term: 'Winter', credits: 3 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch (e) { setMessages([]); }

    try {
      const raw = localStorage.getItem(REG_KEY);
      setRegistrations(raw ? JSON.parse(raw) : {});
    } catch (e) { setRegistrations({}); }

    try {
      const raw = localStorage.getItem(CUSTOM_COURSES_KEY);
      setCustomCourses(raw ? JSON.parse(raw) : []);
    } catch (e) { setCustomCourses([]); }
  }, []);

  const saveCustom = (next) => {
    setCustomCourses(next);
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(next));
  };

  const handleAddCourse = () => {
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

        <section className="panel">
          <h4>Student Registrations (local)</h4>
          {Object.keys(registrations).length === 0 && (
            <p className="muted">No registrations stored locally.</p>
          )}
          {Object.entries(registrations).map(([term, ids]) => (
            <div key={term} className="registration-block">
              <strong>{term} — {ids.length} registration(s)</strong>
              <ul>
                {ids.map(id => (
                  <li key={id}>{(allCourses.find(c => c.id === id) || { code: 'N/A', name: 'Unknown' }).code} — {(allCourses.find(c => c.id === id) || { name: 'Unknown' }).name}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>

      <section className="panel full">
        <h4>Manage Custom Courses</h4>
        <div className="form-row">
          <input className="small-input" placeholder="Code" value={newCourse.code} onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))} />
          <input className="flex-input" placeholder="Name" value={newCourse.name} onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))} />
          <input className="small-input" placeholder="Term" value={newCourse.term} onChange={e => setNewCourse(prev => ({ ...prev, term: e.target.value }))} />
          <input className="tiny-input" placeholder="Credits" type="number" value={newCourse.credits} onChange={e => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))} />
          <button type="button" className="btn btn-primary" onClick={handleAddCourse}>Add</button>
        </div>

        {customCourses.length === 0 ? (
          <p className="muted">No custom courses added.</p>
        ) : customCourses.map(c => (
          <div key={c.id} className="course-card">
            <div>
              <div className="course-title">{c.code} — {c.name}</div>
              <div className="course-meta">Term: {c.term} — Credits: {c.credits}</div>
            </div>
            <div>
              <button type="button" className="btn btn-danger" onClick={() => handleRemoveCustom(c.id)}>Remove</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminDashboard;
