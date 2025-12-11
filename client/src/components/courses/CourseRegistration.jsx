import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TERMS } from '../../data/mockData';
import './courseRegistration.css';

const STORAGE_KEY = 'bvc_registrations';
const API_BASE = 'http://localhost:5000/api';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CourseRegistration = () => {
  const query = useQuery();
  const termFromQuery = query.get('term') || '';
  const [selectedTerm, setSelectedTerm] = useState(termFromQuery);
  const [search, setSearch] = useState('');
  const [allCourses, setAllCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  // map of courseId -> registrationId (DB id)
  const [regMap, setRegMap] = useState({});
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/courses`);
        if (response.ok) {
          const data = await response.json();
          setAllCourses(data);
        } else {
          console.error('Failed to fetch courses');
          setAllCourses([]);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        setAllCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Filter courses by term
  useEffect(() => {
    const filtered = selectedTerm
      ? allCourses.filter((c) => c.term && c.term.toLowerCase() === selectedTerm.toLowerCase())
      : allCourses.slice();
    setAvailableCourses(filtered);
  }, [selectedTerm, allCourses]);

  useEffect(() => {
    // load registrations from server if authenticated, otherwise from localStorage
    const load = async () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        // optimistic local fallback
        const localTermIds = (parsed[selectedTerm] || []).map(id => Number(id));
        const localTermRegistered = localTermIds.map((id) => allCourses.find(c => c.id === id)).filter(Boolean);
        setRegistered(localTermRegistered);

        // if authenticated, fetch from server and prefer server data
        const storedAuth = JSON.parse(localStorage.getItem('auth') || 'null');
        const token = storedAuth && storedAuth.token;
        if (token) {
          const resp = await fetch(`${API_BASE}/registrations`, { headers: { Authorization: `Bearer ${token}` } });
          if (resp.ok) {
            const data = await resp.json();
            // data = array of registration records { id, studentId, courseId, term, code, name }
            const forTerm = data.filter(r => String(r.term).toLowerCase() === String(selectedTerm).toLowerCase());
            const coursesForTerm = forTerm.map(r => allCourses.find(c => c.id === r.courseId)).filter(Boolean);
            setRegistered(coursesForTerm);
            // build regMap
            const map = {};
            forTerm.forEach(r => { map[r.courseId] = r.id; });
            setRegMap(map);
            // persist server-backed ids into localStorage for offline display
            try {
              const allParsed = raw ? JSON.parse(raw) : {};
              allParsed[selectedTerm] = forTerm.map(r => r.courseId);
              localStorage.setItem(STORAGE_KEY, JSON.stringify(allParsed));
            } catch (_e) {}
          }
        }
      } catch (e) {
        // swallow and keep local registered
        console.error('Failed loading registrations:', e);
      }
    };
    load();
  }, [selectedTerm, allCourses]);

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

    // if authenticated, persist to server as well
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (token) {
        (async () => {
          try {
            const resp = await fetch(`${API_BASE}/registrations`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ courseId: course.id, term: selectedTerm })
            });
            if (resp.ok) {
              const created = await resp.json();
              setRegMap(prev => ({ ...prev, [course.id]: created.id }));
            } else {
              // server save failed; inform user but keep local
              setMessage({ type: 'warning', text: 'Saved locally; server save failed.' });
            }
          } catch (e) {
            // network error
            setMessage({ type: 'warning', text: 'Saved locally; server save failed.' });
          }
        })();
      }
    } catch (e) {}

    setMessage({ type: 'success', text: `${course.code} added.` });
  };

  const handleRemove = (course) => {
    const next = registered.filter((c) => c.id !== course.id);
    setRegistered(next);
    persist(selectedTerm, next);

    // if authenticated and we have a reg id, delete on server
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      const regId = regMap[course.id];
      if (token && regId) {
        (async () => {
          try {
            const resp = await fetch(`${API_BASE}/registrations/${regId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
            if (resp.ok) {
              setRegMap(prev => { const n = { ...prev }; delete n[course.id]; return n; });
            } else {
              setMessage({ type: 'warning', text: 'Removed locally; server remove failed.' });
            }
          } catch (e) {
            setMessage({ type: 'warning', text: 'Removed locally; server remove failed.' });
          }
        })();
      }
    } catch (e) {}

    setMessage({ type: 'info', text: `${course.code} removed.` });
  };

  const filtered = availableCourses.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });


  return (
      <div className="course-page">
    {/* Background / Header Video */}
    <div className="course-bg-video">
      <iframe
        width="100%"
        height="400"
        src="https://www.youtube.com/embed/2jPdQ4zuVak?autoplay=1&mute=1&loop=1&playlist=2jPdQ4zuVak&controls=0&showinfo=0"
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
      <div className="course-container">
      <div className="course-panel">
        <h2 className="course-title">Course Registration</h2>

        {loading && <p className="muted">Loading courses from database...</p>}

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
  </div>
  );
};


export default CourseRegistration;
