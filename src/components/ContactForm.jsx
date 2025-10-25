import React, { useState } from 'react';
import '../styles/shared.css';

const MESSAGES_KEY = 'bvc_messages';

const ContactForm = () => {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) return setSuccess({ type: 'error', text: 'Please fill subject and message' });
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      parsed.push({ id: Date.now(), subject: form.subject, message: form.message, timestamp: new Date().toISOString(), from: 'student' });
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(parsed));
      setForm({ subject: '', message: '' });
      setSuccess({ type: 'success', text: 'Message submitted. Admin can view it in the Admin Dashboard.' });
    } catch (err) {
      setSuccess({ type: 'error', text: 'Failed to save message locally.' });
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Contact Admin</h2>
        {success && (
          <div className={`alert alert-${success.type} mb-2`}>
            {success.text}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="form-group mb-2">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={6}
              className="form-control"
            />
          </div>
          <div className="flex-end">
            <button type="submit" className="btn btn-primary">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
