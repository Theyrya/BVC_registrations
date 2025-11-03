import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TERMS } from '../../data/mockData';
import './studentDashboard.css';

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

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (!selectedTerm) return;
    navigate(`/course-registration?term=${encodeURIComponent(selectedTerm)}`);
  };
  return (
    <div className="student-container">
      <div className="student-grid">
        <section className="panel student-info">
          <h3>Student Information</h3>
          <div className="info">
            <p><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</p>
            <p><strong>Student ID:</strong> {studentData.studentId}</p>
            <p><strong>Program:</strong> {studentData.program}</p>
            <p><strong>Department:</strong> {studentData.department}</p>
          </div>
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
            {studentData.registeredCourses.map((course) => (
              <article className="course-card" key={course.code}>
                <div className="course-card-body">
                  <div className="course-code">{course.code}</div>
                  <div className="course-name">{course.name}</div>
                  <div className="course-meta">Term: {course.term}</div>
                  <div className="course-meta">Credits: {course.credits}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
