import React, { useState } from 'react';
import { programs } from '../../data/mockData';
import '../../styles/shared.css';

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
    <div className="container">
      <div className="card">
        <h2 className="text-center">Student Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" name="firstName" required className="form-control" value={formData.firstName} onChange={handleChange} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" name="lastName" required className="form-control" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required className="form-control" value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input id="phone" name="phone" required className="form-control" value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <div>
              <div className="form-group">
                <label htmlFor="birthday">Birthday</label>
                <input id="birthday" name="birthday" type="date" required className="form-control" value={formData.birthday} onChange={handleChange} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input id="department" name="department" required className="form-control" value={formData.department} disabled />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="form-group">
                <label htmlFor="program">Program</label>
                <select id="program" name="program" required className="form-control" value={formData.program} onChange={handleChange}>
                  <option value="">-- select program --</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.code}>{program.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input id="username" name="username" required className="form-control" value={formData.username} onChange={handleChange} />
              </div>
            </div>
            <div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" required className="form-control" value={formData.password} onChange={handleChange} />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" required className="form-control" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex-center mt-3">
            <button type="submit" className="btn btn-primary btn-large">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
