// src/components/admin/AdminCourseDetail.jsx
import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { courses as defaultCourses } from '../../data/mockData';
import './adminDashboard.css'; // reuse panel/card styles

/**
 * We support :courseRef being either a course id or a course code.
 * Also include custom courses if you pass them via location.state (optional).
 */
const AdminCourseDetail = () => {
  const { courseRef } = useParams();

  // Try to pull any custom courses passed via navigation state (optional)
  // so the detail page can show data even if a course is custom-only.
  let customCourses = [];
  try {
    const raw = localStorage.getItem('bvc_custom_courses');
    customCourses = raw ? JSON.parse(raw) : [];
  } catch {
    customCourses = [];
  }

  const allCourses = [...defaultCourses, ...customCourses];

  const course = allCourses.find(c =>
    String(c.id) === String(courseRef) || String(c.code).toLowerCase() === String(courseRef).toLowerCase()
  );

  if (!course) {
    // If nothing matched, send back to Manage Courses tab
    return <Navigate to="/admin/dashboard?tab=courses" replace />;
  }

  return (
    <div className="admin-container">
      <h2 className="admin-title">Course Details</h2>

      <div className="panel">
        <div className="card-body">
          <h3 style={{ marginTop: 0 }}>
            {course.code} — {course.name}
          </h3>
          <p className="card-meta">
            <strong>Term:</strong> {course.term} {course.credits != null ? <> • <strong>Credits:</strong> {course.credits}</> : null}
          </p>

          {/* Optional extended fields if present in your mock data */}
          {course.description && <p className="card-text">{course.description}</p>}
          {course.prerequisites && Array.isArray(course.prerequisites) && course.prerequisites.length > 0 && (
            <p className="card-meta"><strong>Prerequisites:</strong> {course.prerequisites.join(', ')}</p>
          )}
          {course.instructor && (
            <p className="card-meta"><strong>Instructor:</strong> {course.instructor}</p>
          )}
          {course.schedule && (
            <p className="card-meta"><strong>Schedule:</strong> {course.schedule}</p>
          )}
          {course.location && (
            <p className="card-meta"><strong>Location:</strong> {course.location}</p>
          )}

          <Link className="btn btn-primary" to="/admin/dashboard?tab=courses" style={{ marginTop: 8 }}>
            ← Back to Manage Courses
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetail;