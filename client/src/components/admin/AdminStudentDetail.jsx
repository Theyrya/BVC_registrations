// src/components/admin/AdminStudentDetail.jsx
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { students, courses } from '../../data/mockData';
import './adminDashboard.css'; // reuse existing panel/card styles

const AdminStudentDetail = () => {
  const { studentId } = useParams();

  // Find by internal id OR by BVC studentId (support both)
  const student =
    students.find(s => s.id === studentId) ||
    students.find(s => s.studentId === studentId);

  if (!student) {
    return <Navigate to="/admin/dashboard?tab=students" replace />;
  }

  // helper: find course by code or id
  const findCourse = (ref) => {
    if (!ref) return null;
    return (
      courses.find(c => c.code === ref) ||
      courses.find(c => String(c.id) === String(ref)) ||
      null
    );
  };

  const terms = Object.keys(student.registrations || {});

  return (
    <div className="admin-container">
      <h2 className="admin-title">Student Details</h2>

      <div className="panel">
        <div className="card-body">
          <h3 style={{ marginTop: 0 }}>
            {student.firstName} {student.lastName} <span className="muted">— {student.studentId}</span>
          </h3>
          <p className="muted">{student.program} • {student.department}</p>
          <p className="muted">{student.email}</p>
          <Link className="btn btn-primary" to="/admin/dashboard?tab=students" style={{ marginTop: 8 }}>
            ← Back to Students
          </Link>
        </div>
      </div>

      <div className="panel">
        <h3>Registrations</h3>
        {terms.length === 0 ? (
          <p className="muted">No registrations on file.</p>
        ) : (
          terms.map(term => {
            const list = student.registrations[term] || [];
            return (
              <div key={term} className="card">
                <div className="card-body">
                  <strong>{term}</strong> — {list.length} course(s)
                  <ul className="registration-block">
                    {list.map((ref, idx) => {
                      const course = findCourse(ref) || { code: ref, name: 'Unknown course' };
                      return (
                        <li key={`${term}-${ref}-${idx}`}>
                          {course.code} — {course.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AdminStudentDetail;