// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navigation from './components/navigation/Navigation';
import Signup from './components/auth/Signup.jsx';
import Login from './components/auth/Login.jsx';
import ProgramList from './components/programs/ProgramList.jsx';
import StudentDashboard from './components/dashboard/StudentDashboard.jsx';
import CourseRegistration from './components/courses/CourseRegistration.jsx';
import Profile from './components/profile/Profile.jsx';
import ContactForm from './components/contactform/ContactForm.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminStudentDetail from './components/admin/AdminStudentDetail.jsx';
import AdminCourseDetail from './components/admin/AdminCourseDetail.jsx';

import './App.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Restore auth state
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth'));
      if (stored?.isAuthenticated) {
        setIsAuthenticated(true);
        setIsAdmin(!!stored.isAdmin);
        setCurrentUser(stored.user ?? null);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAuth = (auth, admin = false, user = null) => {
    setIsAuthenticated(!!auth);
    setIsAdmin(!!admin);
    setCurrentUser(user ?? null);
    if (auth) {
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, isAdmin: admin, user }));
    } else {
      localStorage.removeItem('auth');
    }
  };

  const handleLogout = () => handleAuth(false);

  // Route guards
  const PrivateRoute = ({ children }) =>
    isAuthenticated ? children : <Navigate to="/login" replace />;

  const AdminRoute = ({ children }) =>
    isAuthenticated && isAdmin ? children : <Navigate to="/" replace />;

  return (
    <Router>
      <Navigation isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />
      <Routes>
        {/* Public */}
        <Route path="/" element={<ProgramList />} />
        <Route path="/programs" element={<ProgramList />} />
        {/* Temporary alias for 'courses' landing; reuse ProgramList for now */}
        <Route path="/courses" element={<ProgramList />} />
        <Route path="/signup" element={<Signup onSignup={(u) => handleAuth(true, false, u)} />} />
        <Route path="/login" element={<Login onLogin={handleAuth} />} />

        {/* Student */}
        <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/course-registration" element={<PrivateRoute><CourseRegistration /></PrivateRoute>} />
        <Route path="/contact" element={<PrivateRoute><ContactForm /></PrivateRoute>} />

        {/* Admin (single page, tabbed by query string) */}
        <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/students/:studentId" element={<AdminRoute><AdminStudentDetail /></AdminRoute>}/>
        <Route path="/admin/courses/:courseRef" element={<AdminRoute><AdminCourseDetail /></AdminRoute>}/>



        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
