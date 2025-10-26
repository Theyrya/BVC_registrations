import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import Signup from './components/auth/Signup.jsx';
import Login from './components/auth/Login.jsx';
import ProgramList from './components/programs/ProgramList.jsx';
import StudentDashboard from './components/dashboard/StudentDashboard.jsx';
import CourseRegistration from './components/courses/CourseRegistration.jsx';
import Profile from './components/profile/Profile.jsx';
import ContactForm from './components/ContactForm.jsx';
import AdminDashboard from './components/admin/AdminDashboard.jsx';
import './App.css';

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Read persisted auth on mount
  useEffect(() => {
    const storedAuth = JSON.parse(localStorage.getItem('auth'));
    if (storedAuth && storedAuth.isAuthenticated) {
      setIsAuthenticated(true);
      setIsAdmin(!!storedAuth.isAdmin);
      setCurrentUser(storedAuth.user || null);
    }
  }, []);

  // centralized auth handler (used by Login/Signup)
  const handleAuth = (auth, admin = false, user = null) => {
    setIsAuthenticated(auth);
    setIsAdmin(admin);
    setCurrentUser(user);

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
        <Navigation isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={handleLogout} />

        <Routes>
          {/* Public */}
          <Route path="/" element={<ProgramList />} />
          <Route path="/programs" element={<ProgramList />} />
          <Route path="/signup" element={<Signup onSignup={handleAuth} />} />
          <Route path="/login" element={<Login onLogin={handleAuth} />} />

          {/* Protected student routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <StudentDashboard /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/course-registration"
            element={isAuthenticated ? <CourseRegistration /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/contact"
            element={isAuthenticated ? <ContactForm /> : <Navigate to="/login" replace />}
          />

          {/* Admin */}
          <Route
            path="/admin/dashboard"
            element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />}
          />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
