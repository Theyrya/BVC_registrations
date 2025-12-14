import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TERMS } from '../../data/mockData';
import './studentDashboard.css';

const STORAGE_KEY = 'bvc_registrations';
const API_BASE = 'http://localhost:5000/api';

const StudentDashboard = () => {
    useEffect(() => {
  document.body.classList.add('dashboard-route')
  return () => {
    document.body.classList.remove('dashboard-route');
  };},[]);
  const [selectedTerm, setSelectedTerm] = useState('');
  const [registrations, setRegistrations] = useState({});
  const [studentData, setStudentData] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  
  useEffect(() => {
    // Load current user data from auth
    try {
      const stored = JSON.parse(localStorage.getItem('auth'));
      if (stored && stored.user) {
        setStudentData(stored.user);
      }
    } catch (e) {
      console.error('Failed to load user data:', e);
    }

    // Load course registrations
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setRegistrations(raw ? JSON.parse(raw) : {});
    } catch (e) {
      console.error('Failed to load registrations:', e);
      setRegistrations({});
    }
  }, []);

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_BASE}/courses`);
        if (response.ok) {
          const data = await response.json();
          setAllCourses(data);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (!selectedTerm) return;
    navigate(`/course-registration?term=${encodeURIComponent(selectedTerm)}`);
  };
  return (
    <div className='dashboard-page'>
    <div className="student-container">
      <div className="student-grid">
        <section className="panel student-info">
          <h3>Student Information</h3>
          {studentData ? (
            <div className="info">
              <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
              <p><strong>Student ID:</strong> {studentData.studentId || studentData.id || '—'}</p>
              <p><strong>Program:</strong> {studentData.program || '—'}</p>
              <p><strong>Department:</strong> {studentData.department || '—'}</p>
            </div>
          ) : (
            <p className="muted">Loading student information...</p>
          )}
        </section>

        <section className="panel term-select">
          <h3>Course Registration</h3>
          <div className="term-control">
            <label className="term-label">Select Term</label>
            <select value={selectedTerm} onChange={handleTermChange} className="term-select-input">
              <option value="">-- Select term --</option>
              {TERMS.map((term) => (
                <option key={term} value={term}>{term}</option>
              ))}
            </select>
          </div>
          <div className="actions-row">
            <button className="btn btn-primary" disabled={!selectedTerm} onClick={handleRegisterClick}>Register for Courses</button>
          </div>
        </section>

        <section className="panel full registered-courses">
          <h3>Currently Registered Courses</h3>
          <div className="courses-grid">
            {Object.entries(registrations).map(([term, courseIds]) => (
              <div key={term} className="term-section">
                <h4>{term}</h4>
                {courseIds.map(id => {
                  const course = allCourses.find(c => c.id === id);
                  if (!course) return null;
                  return (
                    <article className="course-card" key={course.id}>
                      <div className="course-card-body">
                        <div className="course-code">{course.code}</div>
                        <div className="course-name">{course.name}</div>
                        <div className="course-meta">Term: {course.term}</div>
                        <div className="course-meta">Credits: {course.credits}</div>
                      </div>
                    </article>
                  );
                })}
                {courseIds.length === 0 && (
                  <p className="muted">No courses registered for {term}</p>
                )}
              </div>
            ))}
            {Object.keys(registrations).length === 0 && (
              <p className="muted">You haven't registered for any courses yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
    </div>
  );
};

export default StudentDashboard;
