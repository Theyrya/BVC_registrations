import React, { useState } from 'react';
import './contactForm.css';

const MESSAGES_KEY = 'bvc_messages';

const ContactForm = () => {
  const [form, setForm] = useState({ subject: '', message: '' });
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subject || !form.message) return setSuccess({ type: 'error', text: 'Please fill subject and message' });
    try {
      // If logged in, try to POST to API with user's name/email. Otherwise save locally.
      const stored = JSON.parse(localStorage.getItem('auth')) || {};
      const token = stored.token;
      const user = stored.user || null;

      if (token) {
        // send to backend
        fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'Student', email: user ? user.email : '', subject: form.subject, body: form.message })
        }).then(async (resp) => {
          if (!resp.ok) throw new Error('Failed to send message');
          setForm({ subject: '', message: '' });
          setSuccess({ type: 'success', text: 'Message submitted. Admin can view it in the Admin Dashboard.' });
        }).catch(err => {
          console.error('Failed to send to server, saving locally', err);
          const raw = localStorage.getItem(MESSAGES_KEY);
          const parsed = raw ? JSON.parse(raw) : [];
          const from = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'student';
          parsed.push({ id: Date.now(), subject: form.subject, message: form.message, timestamp: new Date().toISOString(), from });
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(parsed));
          setForm({ subject: '', message: '' });
          setSuccess({ type: 'success', text: 'Message saved locally. Admin can view it in the Admin Dashboard.' });
        });
      } else {
        const raw = localStorage.getItem(MESSAGES_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        const from = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username : 'student';
        parsed.push({ id: Date.now(), subject: form.subject, message: form.message, timestamp: new Date().toISOString(), from });
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(parsed));
        setForm({ subject: '', message: '' });
        setSuccess({ type: 'success', text: 'Message submitted. Admin can view it in the Admin Dashboard.' });
      }
    } catch (err) {
      setSuccess({ type: 'error', text: 'Failed to save message locally.' });
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-panel">
        <h2 className="contact-title">Contact Admin</h2>
        {success && (
          <div className={`alert ${success.type}`} role="alert">
            {success.text}
          </div>
        )}
        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="6"
              className="form-textarea"
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-submit">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
