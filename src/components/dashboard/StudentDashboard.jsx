import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TERMS } from '../../data/mockData';
import '../../styles/shared.css';

const StudentDashboard = () => {
  const [selectedTerm, setSelectedTerm] = useState('');
  
  // Mock student data (replace with actual data from backend)
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: 'BVC123456',
    program: 'Software Development - Diploma',
    department: 'SD',
    registeredCourses: [
      {
        code: 'SODV2201',
        name: 'Web Programming',
        term: 'Winter',
        credits: 3
      }
    ]
  };

  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (!selectedTerm) return;
    navigate(`/course-registration?term=${encodeURIComponent(selectedTerm)}`);
  };

  return (
    <div className="container">
      <div className="grid grid-2">
        {/* Student Information Card */}
        <div className="card">
          <h2 className="section-title">Student Information</h2>
          <div className="mt-2">
            <p className="mb-2">
              <strong>Name:</strong> {studentData.firstName} {studentData.lastName}
            </p>
            <p className="mb-2">
              <strong>Student ID:</strong> {studentData.studentId}
            </p>
            <p className="mb-2">
              <strong>Program:</strong> {studentData.program}
            </p>
            <p className="mb-2">
              <strong>Department:</strong> {studentData.department}
            </p>
          </div>
        </div>

        {/* Term Selection Card */}
        <div className="card">
          <h2 className="section-title">Course Registration</h2>
          <div className="form-group">
            <select
              className="form-control"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              <option value="">-- Select Term --</option>
              {TERMS.map((term) => (
                <option key={term} value={term}>
                  {term}
                </option>
              ))}
            </select>
          </div>
          <div className="flex" style={{ justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              disabled={!selectedTerm}
              onClick={handleRegisterClick}
            >
              Register for Courses
            </button>
          </div>
        </div>

        {/* Registered Courses Card */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <h2 className="section-title">Currently Registered Courses</h2>
          <div className="grid grid-3">
            {studentData.registeredCourses.map((course) => (
              <div className="card" key={course.code}>
                <h3>{course.code}</h3>
                <p className="text-secondary">{course.name}</p>
                <p className="mt-2">Term: {course.term}</p>
                <p>Credits: {course.credits}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
