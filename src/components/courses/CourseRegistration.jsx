import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { courses as allCourses, TERMS } from '../../data/mockData';
import '../../styles/shared.css';

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
    <div className="container">
      <div className="card">
        <h1 className="section-title">Course Registration</h1>

        <div className="flex gap-2 mb-3">
          <div className="form-group">
            <select
              className="form-control"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="">-- Select term --</option>
              {TERMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by code or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="badge badge-primary">
            Selected: {registered.length}
          </div>
        </div>

        {message && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
            <button className="btn" style={{ float: 'right' }} onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        <div className="grid grid-2">
          <div style={{ gridColumn: '1 / span 2' }}>
            <h2 className="section-title">Available Courses ({filtered.length})</h2>
            <div className="grid grid-2">
              {filtered.map((course) => (
                <div className="card" key={course.id}>
                  <h3>{course.code}</h3>
                  <p className="text-secondary">{course.name}</p>
                  <p>Term: {course.term}</p>
                  <p className="mb-2">Credits: {course.credits}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAdd(course)}
                    disabled={registered.find(c => c.id === course.id) || registered.length >= 5}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ gridColumn: '1 / span 2' }}>
            <h2 className="section-title">Your Selection</h2>
            {registered.length === 0 ? (
              <p>No courses selected yet.</p>
            ) : (
              <div className="grid grid-3">
                {registered.map((course) => (
                  <div className="card" key={course.id}>
                    <h3>{course.code}</h3>
                    <p className="text-secondary">{course.name}</p>
                    <p className="mb-2">Credits: {course.credits}</p>
                    <button className="btn btn-danger" onClick={() => handleRemove(course)}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            <p className="mt-3 text-secondary">
              Note: You must select at least 2 and at most 5 courses per term. 
              Submitting is simulated and saved locally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRegistration;
