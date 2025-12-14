import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { programs } from '../../data/mockData';
import './signup.css';

const API_BASE = 'http://localhost:5000/api';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
      useEffect(() => {
    document.body.classList.add('signup-route');
     return () => {
      document.body.classList.remove('signup-route');
    };
  }, []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    department: 'SD',
    program: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          birthday: formData.birthday,
          department: formData.department,
          program: formData.program,
          username: formData.username,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Signup failed. Please try again.');
        return;
      }

      // Save auth token and user data to localStorage
      const { token, user } = data;
      localStorage.setItem('auth', JSON.stringify({ 
        isAuthenticated: true, 
        token,
        user 
      }));

      // If parent provided a handler, call it (backwards-compatible)
      if (onSignup) onSignup(true, user.isAdmin, user, token);

      console.log('Registered user:', user);

      // Redirect to root (dashboard view at `/`) after signup
      navigate('/');
    } catch (err) {
      setError('Error connecting to server. Make sure the backend is running.');
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="signup-page">
    <div className="signup-shell">

      <div className="signup-left">
        <div className="signup-brand">
          <div className="brand-badge">BVC</div>
          <div>
            <div className="brand-title">BVC Registrations</div>
            <div className="brand-subtitle">Student onboarding portal</div>
          </div>
        </div>

        <div className="signup-left-card">
          <h3>Welcome 👋</h3>
          <p>Create your student profile to access registration and dashboard.</p>

          <div className="left-features">
            <div className="feature">Fast • 1–2 mins</div>
            <div className="feature">Secure • Encrypted</div>
            <div className="feature">Simple • Step-by-step</div>
          </div>
        </div>

        <div className="left-footer">Registration support available during office hours</div>
      </div>

      <div className="signup-right">
        <div className="signup-card">
          <h2 className="signup-title">Student Registration</h2>
          <p className="signup-subtitle">Fill in your details to create an account</p>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="signup-form" noValidate>
            <div className="grid">
              <label className="field">
                First Name
                <input
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Last Name
                <input
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Email
                <input
                  required
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Phone
                <input
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Birthday
                <input
                  required
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Department
                <input
                  required
                  name="department"
                  value={formData.department}
                  disabled
                  className="input"
                />
              </label>

              <label className="field field-full">
                Program
                <select
                  required
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="" disabled>Choose a program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.code}>
                      {program.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                Username
                <input
                  required
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field">
                Password
                <input
                  required
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                />
              </label>

              <label className="field field-full">
                Confirm Password
                <input
                  required
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input"
                />
              </label>
            </div>

            <div className="actions">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Signing Up..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
  </div>
  </div>
);
};

export default Signup;
