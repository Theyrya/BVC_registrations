import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/shared.css';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Load users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // First handle built-in admin fallback if no admin user stored
    if (formData.username === 'admin' && formData.password === 'admin123') {
      const adminUser = { username: 'admin', isAdmin: true };
      if (onLogin) onLogin(true, true, adminUser);
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, isAdmin: true, user: adminUser }));
      navigate('/admin/dashboard');
      return;
    }

    // Validate against stored users
    const found = users.find(u => u.username === formData.username && u.password === formData.password);

    if (found) {
      const isAdmin = !!found.isAdmin;
      if (onLogin) onLogin(true, isAdmin, found);
      localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, isAdmin, user: found }));
      navigate(isAdmin ? '/admin/dashboard' : '/dashboard');
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center">Login</h2>

        {error && <div className="alert alert-error mb-2">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" required className="form-control" value={formData.username} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" required className="form-control" value={formData.password} onChange={handleChange} />
          </div>

          <div className="flex-center mt-3">
            <button type="submit" className="btn btn-primary btn-large">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
