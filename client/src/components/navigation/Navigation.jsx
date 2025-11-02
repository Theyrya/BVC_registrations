// src/components/navigation/Navigation.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navigation.css';

const Navigation = ({ isAuthenticated, isAdmin, onLogout }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="nav-header">
      <div className="nav-container">
        <h2 className="nav-brand">BVC Registration</h2>

        {!isAuthenticated ? (
          <nav className="nav-menu">
            <Link className="nav-link" to="/programs">Programs</Link>
            <Link className="nav-link" to="/courses">Courses</Link>
            <Link className="nav-link" to="/signup">Sign Up</Link>
            <Link className="nav-link" to="/login">Login</Link>
          </nav>
        ) : isAdmin ? (
          <nav className="nav-menu">
            <Link className="nav-link" to="/admin/AdminDashboard">Dashboard</Link>
            <Link className="nav-link" to="/admin/dashboard?tab=courses">Manage Courses</Link>
            <Link className="nav-link" to="/admin/dashboard?tab=students">View Students</Link>
            <Link className="nav-link" to="/admin/dashboard?tab=messages">Messages</Link>
            <button className="nav-link" onClick={handleLogout}>Logout</button>
          </nav>
        ) : (
          <nav className="nav-menu">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/profile">Profile</Link>
            <Link className="nav-link" to="/course-registration">Register Courses</Link>
            <Link className="nav-link" to="/contact">Contact Admin</Link>
            <button className="nav-link" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navigation;
