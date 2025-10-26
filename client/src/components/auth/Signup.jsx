import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { programs } from '../../data/mockData';
import './signup.css';

const Signup = ({ onSignup }) => {
  const navigate = useNavigate();
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    // Generate a random student ID (in real app this would come from backend)
    const studentId = 'BVC' + Math.floor(100000 + Math.random() * 900000);

    // Save user to localStorage (simple local mock of registration)
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    const duplicate = existingUsers.some(u => u.username === formData.username);
    if (duplicate) {
      alert('Username already exists. Choose another username.');
      return;
    }

    const user = { ...formData, studentId, isAdmin: false };
    const updatedUsers = [...existingUsers, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Persist auth state locally so reloads can read it
    localStorage.setItem('auth', JSON.stringify({ isAuthenticated: true, isAdmin: false, user }));

    // If parent provided a handler, call it (backwards-compatible)
    if (onSignup) onSignup(true, false, user);

    console.log('Registered user:', user);

    // Redirect to programs list
    navigate('/programs');
  };

  return (
    <div className="signup-container">
      <div className="signup-paper">
        <h2 className="signup-title">Student Registration</h2>

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
            <button type="submit" className="submit-button">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
