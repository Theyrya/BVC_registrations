import React, { useEffect, useState } from 'react';
import { courses as defaultCourses } from '../../data/mockData';
import '../../styles/shared.css';

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
    <div className="container">
      <h1 className="page-title">Admin Dashboard</h1>
      <div className="grid grid-2">
        <div className="card">
          <h2 className="section-title">Messages</h2>
          {messages.length === 0 ? (
            <p>No messages submitted yet.</p>
          ) : messages.map(m => (
            <div className="card mb-2" key={m.id}>
              <h3>{m.subject}</h3>
              <p>{m.message}</p>
              <p className="text-secondary">
                From: {m.from} — {new Date(m.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 className="section-title">Student Registrations (local)</h2>
          {Object.keys(registrations).length === 0 && (
            <p>No registrations stored locally.</p>
          )}
          {Object.entries(registrations).map(([term, ids]) => (
            <div className="mb-2" key={term}>
              <h3>{term} — {ids.length} registration(s)</h3>
              <ul>
                {ids.map(id => (
                  <li key={id}>
                    {(allCourses.find(c => c.id === id) || { code: 'N/A', name: 'Unknown' }).code} — 
                    {(allCourses.find(c => c.id === id) || { name: 'Unknown' }).name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h2 className="section-title">Manage Custom Courses</h2>
          <div className="flex gap-2 mb-3">
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Course Code"
                value={newCourse.code}
                onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))}
              />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder="Course Name"
                value={newCourse.name}
                onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                placeholder="Term"
                value={newCourse.term}
                onChange={e => setNewCourse(prev => ({ ...prev, term: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-control"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={e => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))}
              />
            </div>
            <button className="btn btn-primary" onClick={handleAddCourse}>
              Add Course
            </button>
          </div>

          {customCourses.length === 0 ? (
            <p>No custom courses added.</p>
          ) : customCourses.map(c => (
            <div className="card mb-2" key={c.id}>
              <div className="flex flex-between flex-center">
                <div>
                  <h3>{c.code} — {c.name}</h3>
                  <p className="text-secondary">Term: {c.term} — Credits: {c.credits}</p>
                </div>
                <button className="btn btn-danger" onClick={() => handleRemoveCustom(c.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



export default AdminDashboard;
