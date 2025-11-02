import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login logic (replace with actual backend integration later)
    if (formData.username === 'admin' && formData.password === 'admin123') {
      onLogin(true, true); // isAuthenticated, isAdmin
      navigate('/admin/AdminDashboard');
    } else if (formData.username && formData.password) {
      onLogin(true, false); // isAuthenticated, not admin
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-paper">
        <h2 className="login-title">Login</h2>
        {error && (
          <div role="alert" className="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <label className="login-label">
            Username
            <input
              className="login-input"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
              aria-label="username"
            />
          </label>

          <label className="login-label">
            Password
            <input
              className="login-input"
              required
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              aria-label="password"
            />
          </label>

          <div className="login-actions">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
