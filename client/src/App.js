import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/navigation/Navigation';
import HeroSection from './components/HeroSection';
import Signup from './components/auth/Signup.jsx';
import Login from './components/auth/Login.jsx';
import ProgramList from './components/programs/ProgramList.jsx';
import StudentDashboard from './components/dashboard/StudentDashboard.jsx';
import CourseRegistration from './components/courses/CourseRegistration.jsx';
import Profile from './components/profile/Profile.jsx';
import ContactForm from './components/contactform/ContactForm.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import AdminStudents from './components/admin/AdminStudents.jsx';
import AdminMessages from './components/admin/AdminMessages.jsx';
import AdminCourses from './components/admin/AdminCourses.jsx';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('auth'));
      return !!(s && s.isAuthenticated);
    } catch (e) {
      return false;
    }
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('auth'));
      return !!(s && s.isAdmin);
    } catch (e) {
      return false;
    }
  });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem('auth'));
      return (s && s.user) || null;
    } catch (e) {
      return null;
    }
  });

  // On mount, if we have a token, fetch fresh user profile from backend
  useEffect(() => {
    const tryRefresh = async () => {
      try {
        const s = JSON.parse(localStorage.getItem('auth')) || {};
        const token = s.token;
        if (!token) return;
        const resp = await fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!resp.ok) return;
        const data = await resp.json();
        if (data && data.user) {
          setCurrentUser(data.user);
          setIsAdmin(!!data.user.isAdmin);
          setIsAuthenticated(true);
          // update localStorage with refreshed user
          localStorage.setItem('auth', JSON.stringify({ ...(s || {}), isAuthenticated: true, isAdmin: !!data.user.isAdmin, user: data.user, token }));
        }
      } catch (e) {
        // ignore
      }
    };
    tryRefresh();
  }, []);

  const handleAuth = (auth, admin = false, user = null, token = null) => {
    setIsAuthenticated(!!auth);
    setIsAdmin(!!admin);
    setCurrentUser(user || null);
    if (auth) {
      // preserve existing token if caller didn't provide one
      try {
        const stored = JSON.parse(localStorage.getItem('auth')) || {};
        const effectiveToken = token || stored.token || null;
        const out = { isAuthenticated: true, isAdmin: admin, user: user || stored.user || null };
        if (effectiveToken) out.token = effectiveToken;
        localStorage.setItem('auth', JSON.stringify(out));
      } catch (e) {
        const out = { isAuthenticated: true, isAdmin: admin, user };
        if (token) out.token = token;
        try { localStorage.setItem('auth', JSON.stringify(out)); } catch (_) {}
      }
    } else {
      localStorage.removeItem('auth');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
    localStorage.removeItem('auth');
  };

  return (
    <Router>
      <div className="App">
        <Navigation 
          isAuthenticated={isAuthenticated} 
          isAdmin={isAdmin} 
          onLogout={handleLogout}
        />
        <HeroSection />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<ProgramList />} />
            <Route path="/programs" element={<ProgramList />} />
            <Route path="/courses" element={<CourseRegistration />} />
            <Route path="/signup" element={<Signup onSignup={handleAuth} />} />
            <Route path="/login" element={<Login onLogin={handleAuth} />} />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />
            <Route
              path="/course-registration"
              element={
                isAuthenticated ? (
                  <CourseRegistration />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  <Profile />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/contact"
              element={
                isAuthenticated ? (
                  <ContactForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/admin/dashboard"
              element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/courses"
              element={isAuthenticated && isAdmin ? <AdminCourses /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/students"
              element={isAuthenticated && isAdmin ? <AdminStudents /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin/messages"
              element={isAuthenticated && isAdmin ? <AdminMessages /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
//zz

export default App;
