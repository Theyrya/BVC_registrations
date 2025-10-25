import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courses as allCourses, TERMS } from '../../data/mockData';
import './courseRegistration.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const STORAGE_KEY = 'bvc_registrations';

const CourseRegistration = () => {
  const query = useQuery();
  const termFromQuery = query.get('term') || '';
  const [selectedTerm, setSelectedTerm] = useState(termFromQuery);
  const [search, setSearch] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Initialize available courses based on term
    const filtered = selectedTerm
      ? allCourses.filter((c) => c.term.toLowerCase() === selectedTerm.toLowerCase())
      : allCourses.slice();
    setAvailableCourses(filtered);
  }, [selectedTerm]);

  useEffect(() => {
    // load registrations from localStorage (per term)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const termRegistered = (parsed[selectedTerm] || []).map((id) => allCourses.find(c => c.id === id)).filter(Boolean);
      setRegistered(termRegistered);
    } catch (e) {
      setRegistered([]);
    }
  }, [selectedTerm]);

  const persist = (term, registeredList) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[term] = registeredList.map(c => c.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to persist registrations', e);
    }
  };

  const handleAdd = (course) => {
    if (!selectedTerm) {
      setMessage({ type: 'error', text: 'Please select a term before adding courses.' });
      return;
    }

    if (registered.find((c) => c.id === course.id)) {
      setMessage({ type: 'warning', text: 'You have already added this course for the selected term.' });
      return;
    }

    if (registered.length >= 5) {
      setMessage({ type: 'error', text: 'You may register for a maximum of 5 courses per term.' });
      return;
    }

    const next = [...registered, course];
    setRegistered(next);
    persist(selectedTerm, next);
    setMessage({ type: 'success', text: `${course.code} added.` });
  };

  const handleRemove = (course) => {
    const next = registered.filter((c) => c.id !== course.id);
    setRegistered(next);
    persist(selectedTerm, next);
    setMessage({ type: 'info', text: `${course.code} removed.` });
  };

  const filtered = availableCourses.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <div className="course-container">
      <div className="course-panel">
        <h2 className="course-title">Course Registration</h2>

        <div className="controls">
          <select className="select" value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)}>
            <option value="">-- Select term --</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input className="search" placeholder="Search by code or name" value={search} onChange={(e) => setSearch(e.target.value)} />

          <div className="chip">Selected: <span className={`count ${registered.length < 2 ? 'warning' : 'primary'}`}>{registered.length}</span></div>
        </div>

        {message && (
          <div className={`alert ${message.type}`} role="alert">
            <button className="close" onClick={() => setMessage(null)} aria-label="close">×</button>
            {message.text}
          </div>
        )}

        <div className="course-grid">
          <div className="available">
            <h3>Available Courses ({filtered.length})</h3>
            <div className="cards">
              {filtered.map((course) => (
                <div className="card" key={course.id}>
                  <div className="card-content">
                    <div className="course-code">{course.code}</div>
                    <div className="course-name">{course.name}</div>
                    <div className="course-meta">Term: {course.term}</div>
                    <div className="course-meta">Credits: {course.credits}</div>
                  </div>
                  <div className="card-actions">
                    <button className="btn" onClick={() => handleAdd(course)} disabled={registered.find(c => c.id === course.id) || registered.length >= 5}>Add</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="selection">
            <h3>Your Selection</h3>
            {registered.length === 0 ? (
              <p className="muted">No courses selected yet.</p>
            ) : (
              <div className="selected-list">
                {registered.map((course) => (
                  <div className="card" key={course.id}>
                    <div className="card-content">
                      <div className="course-code">{course.code} — {course.name}</div>
                      <div className="course-meta">Credits: {course.credits}</div>
                    </div>
                    <div className="card-actions">
                      <button className="btn btn-danger" onClick={() => handleRemove(course)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="note">Note: You must select at least 2 and at most 5 courses per term. Submitting is simulated and saved locally.</div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
