import React, { useState } from 'react';
import { programs } from '../../data/mockData';
import './signup.css';

const Signup = () => {
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
    // Generate a random student ID (in real app this would come from backend)
    const studentId = 'BVC' + Math.floor(100000 + Math.random() * 900000);
    console.log('Form submitted:', { ...formData, studentId });
    // Here you would typically make an API call to register the user
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
