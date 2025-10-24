import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Grid, Card, CardContent, Box, Button, TextField } from '@mui/material';
import { courses as defaultCourses } from '../../data/mockData';

const MESSAGES_KEY = 'bvc_messages';
const REG_KEY = 'bvc_registrations';
const CUSTOM_COURSES_KEY = 'bvc_custom_courses';

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [registrations, setRegistrations] = useState({});
  const [customCourses, setCustomCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({ code: '', name: '', term: 'Winter', credits: 3 });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch (e) { setMessages([]); }

    try {
      const raw = localStorage.getItem(REG_KEY);
      setRegistrations(raw ? JSON.parse(raw) : {});
    } catch (e) { setRegistrations({}); }

    try {
      const raw = localStorage.getItem(CUSTOM_COURSES_KEY);
      setCustomCourses(raw ? JSON.parse(raw) : []);
    } catch (e) { setCustomCourses([]); }
  }, []);

  const saveCustom = (next) => {
    setCustomCourses(next);
    localStorage.setItem(CUSTOM_COURSES_KEY, JSON.stringify(next));
  };

  const handleAddCourse = () => {
    const course = { id: Date.now(), ...newCourse };
    const next = [...customCourses, course];
    saveCustom(next);
    setNewCourse({ code: '', name: '', term: 'Winter', credits: 3 });
  };

  const handleRemoveCustom = (id) => {
    const next = customCourses.filter(c => c.id !== id);
    saveCustom(next);
  };

  const allCourses = [...defaultCourses, ...customCourses];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Messages</Typography>
            {messages.length === 0 ? (
              <Typography variant="body2">No messages submitted yet.</Typography>
            ) : messages.map(m => (
              <Card key={m.id} sx={{ mt: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2">{m.subject}</Typography>
                  <Typography variant="body2">{m.message}</Typography>
                  <Typography variant="caption">From: {m.from} — {new Date(m.timestamp).toLocaleString()}</Typography>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Student Registrations (local)</Typography>
            {Object.keys(registrations).length === 0 && (
              <Typography variant="body2">No registrations stored locally.</Typography>
            )}
            {Object.entries(registrations).map(([term, ids]) => (
              <Box key={term} sx={{ mt: 1 }}>
                <Typography variant="subtitle2">{term} — {ids.length} registration(s)</Typography>
                <ul>
                  {ids.map(id => (
                    <li key={id}>{(allCourses.find(c => c.id === id) || { code: 'N/A', name: 'Unknown' }).code} — {(allCourses.find(c => c.id === id) || { name: 'Unknown' }).name}</li>
                  ))}
                </ul>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Manage Custom Courses</Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, mb: 2 }}>
              <TextField label="Code" value={newCourse.code} onChange={e => setNewCourse(prev => ({ ...prev, code: e.target.value }))} />
              <TextField label="Name" value={newCourse.name} onChange={e => setNewCourse(prev => ({ ...prev, name: e.target.value }))} sx={{ flex: 1 }} />
              <TextField label="Term" value={newCourse.term} onChange={e => setNewCourse(prev => ({ ...prev, term: e.target.value }))} />
              <TextField label="Credits" type="number" value={newCourse.credits} onChange={e => setNewCourse(prev => ({ ...prev, credits: Number(e.target.value) }))} sx={{ width: 100 }} />
              <Button variant="contained" onClick={handleAddCourse}>Add</Button>
            </Box>

            {customCourses.length === 0 ? (
              <Typography variant="body2">No custom courses added.</Typography>
            ) : customCourses.map(c => (
              <Card key={c.id} sx={{ mt: 1 }}>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography>{c.code} — {c.name}</Typography>
                    <Typography variant="caption">Term: {c.term} — Credits: {c.credits}</Typography>
                  </Box>
                  <Button color="error" onClick={() => handleRemoveCustom(c.id)}>Remove</Button>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
