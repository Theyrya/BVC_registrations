import React from 'react';
import { Link } from 'react-router-dom';
import './navigation.style.css';

function Navigation({ isAuthenticated = false, isAdmin = false, onLogout }) {
  const handleLogout = (e) => {
    e && e.preventDefault();
    if (typeof onLogout === 'function') onLogout();
  };

  return (
    <nav className="nav-root">
      <ul className="nav-list">
        <li className="nav-brand"><Link to="/">BVC Registration</Link></li>

        {!isAuthenticated && (
          <>
            <li><Link to="/programs">Programs</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </>
        )}

        {isAuthenticated && isAdmin && (
          <>
            <li><Link to="/admin/dashboard">Dashboard</Link></li>
            <li><Link to="/admin/courses">Manage Courses</Link></li>
            <li><Link to="/admin/students">View Students</Link></li>
            <li><Link to="/admin/messages">Messages</Link></li>
            <li><a href="#logout" onClick={handleLogout}>Logout</a></li>
          </>
        )}

        {isAuthenticated && !isAdmin && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/course-registration">Register Courses</Link></li>
            <li><Link to="/contact">Contact Admin</Link></li>
            <li><a href="#logout" onClick={handleLogout}>Logout</a></li>
          </>
        )}

        {/* Extra example links (fetch/axios) — kept from your simple example */}
        <li><Link to="/fetch">Fetch Example</Link></li>
        <li><Link to="/axios">Axios Example</Link></li>
        <li><Link to="/post">Axios POST Example</Link></li>
        <li><Link to="/post-breakdown">Axios POST Breakdown</Link></li>
        <li><Link to="/update">Axios PUT/UPDATE Example</Link></li>
        <li><Link to="/delete">Axios DELETE Example</Link></li>
      </ul>
    </nav>
  );
}

export default Navigation;

/*
This component provides a simple list-style navigation. It preserves the same
routes and conditional rendering (unauthenticated, authenticated student,
authenticated admin) as the previous MUI-based version but uses plain links
and a CSS file `navigation.style.css` for styling.
*/
