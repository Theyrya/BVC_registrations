import React, { useEffect, useState } from 'react';
import { courses as defaultCourses } from '../../data/mockData';
import './adminDashboard.css';

const CUSTOM_COURSES_KEY = 'bvc_custom_courses';

const AdminCourses = () => {
  const [customCourses, setCustomCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', term: 'Winter', credits: 3 });

  useEffect(() => {
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
      <h3 className="admin-title">Manage Courses</h3>

      <section className="panel full">
        <h4>Default Courses ({defaultCourses.length})</h4>
        <div className="course-list">
          {defaultCourses.map(c => (
            <div key={c.id} className="course-card">
              <div>
                <div className="course-title">{c.code} — {c.name}</div>
                <div className="course-meta">Term: {c.term} — Credits: {c.credits}</div>
              </div>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: 24 }}>Custom Courses ({customCourses.length})</h4>
        <div className="form-row">
          <input className="small-input" placeholder="Code" value={newCourse.code} onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))} />
          <input className="flex-input" placeholder="Name" value={newCourse.name} onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))} />
          <input className="small-input" placeholder="Term" value={newCourse.term} onChange={e => setNewCourse(prev => ({ ...prev, term: e.target.value }))} />
          <input className="tiny-input" placeholder="Credits" type="number" value={newCourse.credits} onChange={e => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))} />
          <button type="button" className="btn btn-primary" onClick={handleAddCourse}>Add</button>
        </div>

        {customCourses.length === 0 ? (
          <p className="muted">No custom courses added.</p>
        ) : (
          <div className="course-list">
            {customCourses.map(c => (
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
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminCourses;