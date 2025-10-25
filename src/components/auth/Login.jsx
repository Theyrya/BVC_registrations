import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/shared.css';

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
      navigate('/admin/dashboard');
    } else if (formData.username && formData.password) {
      onLogin(true, false); // isAuthenticated, not admin
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="text-center">Login</h2>
        {error && (
          <div className="alert alert-error mb-2">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              required
              className="form-control"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
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
