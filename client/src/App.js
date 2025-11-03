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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // restore auth from localStorage on mount
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('auth'));
      if (stored && stored.isAuthenticated) {
        setIsAuthenticated(true);
        setIsAdmin(!!stored.isAdmin);
        setCurrentUser(stored.user || null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const handleAuth = (auth, admin = false, user = null) => {
    setIsAuthenticated(!!auth);
    setIsAdmin(!!admin);
    setCurrentUser(user || null);
    if (auth) {
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, isAdmin: admin, user }));
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

export default App;
