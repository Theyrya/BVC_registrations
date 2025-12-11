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
      <nav className="nav-container">
        <h1 className="nav-brand">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCnDwZfgann-p-VGnuGkLXqCqlj_NKiUWfbA&s"
            alt="logo"
            className="nav-logo"
          />
          BVC Registration
        </h1>
        <div className="nav-menu">
          {!isAuthenticated ? (
            <>
              <Link className="nav-link" to="/programs">
                Programs
              </Link>
              <Link className="nav-link" to="/courses">
                Courses
              </Link>
              <Link className="nav-link" to="/signup">
                Sign Up
              </Link>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </>
          ) : isAdmin ? (
            <>
              <Link className="nav-link" to="/admin/dashboard">
                Dashboard
              </Link>
              <Link className="nav-link" to="/admin/courses">
                Manage Courses
              </Link>
              <Link className="nav-link" to="/admin/students">
                View Students
              </Link>
              <Link className="nav-link" to="/admin/messages">
                Messages
              </Link>
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/">
                Dashboard
              </Link>
              <Link className="nav-link" to="/profile">
                Profile
              </Link>
              <Link className="nav-link" to="/course-registration">
                Register Courses
              </Link>
              <Link className="nav-link" to="/contact">
                Contact Admin
              </Link>
              <button className="nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
