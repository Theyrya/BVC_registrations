import React, { useEffect, useState } from 'react';
import './adminDashboard.css';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', term: 'Winter', credits: 3, description: '' });
  const [editingCourse, setEditingCourse] = useState(null);

  const loadCourses = async () => {
    try {
      const resp = await fetch('http://localhost:5000/api/courses');
      if (resp.ok) setCourses(await resp.json());
    } catch (e) { console.error('Failed to load courses', e); }
  };

  useEffect(() => { loadCourses(); }, []);

  const handleAddCourse = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (!token) return alert('Not authenticated');
      const resp = await fetch('http://localhost:5000/api/courses', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newCourse) });
      if (!resp.ok) throw new Error('Failed to create');
      setNewCourse({ code: '', name: '', term: 'Winter', credits: 3, description: '' });
      await loadCourses();
    } catch (e) {
      console.error(e);
      alert('Failed to add course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (!token) return alert('Not authenticated');
      const resp = await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      if (!resp.ok) throw new Error('Delete failed');
      await loadCourses();
    } catch (e) {
      console.error(e);
      alert('Failed to delete course');
    }
  };

  const handleEdit = (course) => {
    setEditingCourse({ ...course });
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleUpdateCourse = async () => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      if (!token) return alert('Not authenticated');
      const resp = await fetch(`http://localhost:5000/api/courses/${editingCourse.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingCourse)
      });
      if (!resp.ok) throw new Error('Failed to update');
      setEditingCourse(null);
      await loadCourses();
    } catch (e) {
      console.error(e);
      alert('Failed to update course');
    }
  };

  return (
    <div className="admin-container">
      <h3 className="admin-title">Manage Courses</h3>

      <section className="panel full">
        <h4>Add New Course</h4>
        <div className="form-row">
          <input className="small-input" placeholder="Code" value={newCourse.code} onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))} />
          <input className="flex-input" placeholder="Name" value={newCourse.name} onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))} />
          <input className="small-input" placeholder="Term" value={newCourse.term} onChange={e => setNewCourse(prev => ({ ...prev, term: e.target.value }))} />
          <input className="tiny-input" placeholder="Credits" type="number" value={newCourse.credits} onChange={e => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))} />
          <input className="flex-input" placeholder="Description" value={newCourse.description} onChange={e => setNewCourse(prev => ({ ...prev, description: e.target.value }))} />
          <button type="button" className="btn btn-primary" onClick={handleAddCourse}>Add</button>
        </div>
      </section>

      <section className="panel full" style={{ marginTop: '24px' }}>
        <h4>All Courses ({courses.length})</h4>
        <div className="course-list-scrollable">
          {courses.map(c => (
            <div key={c.id} className="course-card">
              {editingCourse && editingCourse.id === c.id ? (
                <div className="edit-course-form">
                  <div className="form-row">
                    <input className="small-input" placeholder="Code" value={editingCourse.code} onChange={e => setEditingCourse(prev => ({ ...prev, code: e.target.value }))} />
                    <input className="flex-input" placeholder="Name" value={editingCourse.name} onChange={e => setEditingCourse(prev => ({ ...prev, name: e.target.value }))} />
                    <input className="small-input" placeholder="Term" value={editingCourse.term} onChange={e => setEditingCourse(prev => ({ ...prev, term: e.target.value }))} />
                    <input className="tiny-input" placeholder="Credits" type="number" value={editingCourse.credits} onChange={e => setEditingCourse(prev => ({ ...prev, credits: Number(e.target.value) }))} />
                    <input className="flex-input" placeholder="Description" value={editingCourse.description} onChange={e => setEditingCourse(prev => ({ ...prev, description: e.target.value }))} />
                    <button type="button" className="btn btn-success" onClick={handleUpdateCourse}>Save</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="course-title">{c.code} — {c.name}</div>
                    <div className="course-meta">Term: {c.term} — Credits: {c.credits}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-edit" onClick={() => handleEdit(c)}>Edit</button>
                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(c.id)}>Remove</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminCourses;