import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { courses as allCourses } from '../../data/mockData';
import './profile.css';

const STORAGE_KEY = 'bvc_registrations';

const Profile = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState({});

  // Mock student data for frontend-only
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: 'BVC123456',
    program: 'Software Development - Diploma',
    department: 'SD'
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      // Map ids back to course objects
      const mapped = {};
      Object.keys(parsed).forEach(term => {
        mapped[term] = (parsed[term] || []).map(id => allCourses.find(c => c.id === id)).filter(Boolean);
      });
      setRegistrations(mapped);
    } catch (e) {
      setRegistrations({});
    }
  }, []);

  const handleGoToTerm = (term) => {
    navigate(`/course-registration?term=${encodeURIComponent(term)}`);
  };

  return (
    <div className="profile-container">
      <div className="profile-panel">
        <h2 className="profile-title">Profile</h2>

        <div className="profile-info">
          <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
          <p><strong>Student ID:</strong> {studentData.studentId}</p>
          <p><strong>Program:</strong> {studentData.program}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
        </div>

        <h3 className="section-title">Registered Courses (by term)</h3>
        {Object.keys(registrations).length === 0 && (
          <p className="muted">You have no registrations saved locally yet.</p>
        )}

        <div className="registrations-list">
          {Object.entries(registrations).map(([term, list]) => (
            <div className="term-card" key={term}>
              <div className="term-header">
                <strong>{term} — {list.length} course(s)</strong>
                <button className="btn" onClick={() => handleGoToTerm(term)}>Manage</button>
              </div>

              {list.length === 0 ? (
                <p className="muted">No courses for this term.</p>
              ) : (
                list.map(c => (
                  <div key={c.id} className="course-line">{c.code} — {c.name}</div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
