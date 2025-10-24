import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';

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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Contact Admin</Typography>
        {success && <Alert severity={success.type} sx={{ mb: 2 }}>{success.text}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Subject" name="subject" value={form.subject} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth multiline rows={6} label="Message" name="message" value={form.message} onChange={handleChange} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained">Send</Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ContactForm;
