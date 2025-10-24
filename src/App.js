import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
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

const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = (authenticated, admin) => {
    setIsAuthenticated(authenticated);
    setIsAdmin(admin);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Navigation 
            isAuthenticated={isAuthenticated} 
            isAdmin={isAdmin} 
            onLogout={handleLogout}
          />
          <Routes>
            <Route path="/" element={<ProgramList />} />
            <Route path="/programs" element={<ProgramList />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
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
            {/* Add more routes as components are created */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
