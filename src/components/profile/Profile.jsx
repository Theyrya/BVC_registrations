import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/shared.css';
import { courses as allCourses } from '../../data/mockData';

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
    <div className="container">
      <div className="card">
        <h2>Profile</h2>
        <div className="mb-2">
          <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
          <p><strong>Student ID:</strong> {studentData.studentId}</p>
          <p><strong>Program:</strong> {studentData.program}</p>
          <p><strong>Department:</strong> {studentData.department}</p>
        </div>

        <h3>Registered Courses (by term)</h3>
        {Object.keys(registrations).length === 0 && (
          <p className="text-muted">You have no registrations saved locally yet.</p>
        )}

        <div className="grid grid-1">
          {Object.entries(registrations).map(([term, list]) => (
            <div key={term}>
              <div className="card">
                <div className="flex-between">
                  <h4>{term} — {list.length} course(s)</h4>
                  <button className="btn btn-small" onClick={() => handleGoToTerm(term)}>Manage</button>
                </div>
                  {list.length === 0 ? (
                    <p className="text-muted">No courses for this term.</p>
                  ) : (
                    list.map(c => (
                      <div key={c.id} className="mt-1">
                        <p>{c.code} — {c.name}</p>
                      </div>
                    ))
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
