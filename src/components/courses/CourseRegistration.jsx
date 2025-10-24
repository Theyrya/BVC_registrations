import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Alert,
  Chip
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { courses as allCourses, TERMS } from '../../data/mockData';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const STORAGE_KEY = 'bvc_registrations';

const CourseRegistration = () => {
  const query = useQuery();
  const termFromQuery = query.get('term') || '';
  const [selectedTerm, setSelectedTerm] = useState(termFromQuery);
  const [search, setSearch] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registered, setRegistered] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    // Initialize available courses based on term
    const filtered = selectedTerm
      ? allCourses.filter((c) => c.term.toLowerCase() === selectedTerm.toLowerCase())
      : allCourses.slice();
    setAvailableCourses(filtered);
  }, [selectedTerm]);

  useEffect(() => {
    // load registrations from localStorage (per term)
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const termRegistered = (parsed[selectedTerm] || []).map((id) => allCourses.find(c => c.id === id)).filter(Boolean);
      setRegistered(termRegistered);
    } catch (e) {
      setRegistered([]);
    }
  }, [selectedTerm]);

  const persist = (term, registeredList) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[term] = registeredList.map(c => c.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to persist registrations', e);
    }
  };

  const handleAdd = (course) => {
    if (!selectedTerm) {
      setMessage({ type: 'error', text: 'Please select a term before adding courses.' });
      return;
    }

    if (registered.find((c) => c.id === course.id)) {
      setMessage({ type: 'warning', text: 'You have already added this course for the selected term.' });
      return;
    }

    if (registered.length >= 5) {
      setMessage({ type: 'error', text: 'You may register for a maximum of 5 courses per term.' });
      return;
    }

    const next = [...registered, course];
    setRegistered(next);
    persist(selectedTerm, next);
    setMessage({ type: 'success', text: `${course.code} added.` });
  };

  const handleRemove = (course) => {
    const next = registered.filter((c) => c.id !== course.id);
    setRegistered(next);
    persist(selectedTerm, next);
    setMessage({ type: 'info', text: `${course.code} removed.` });
  };

  const filtered = availableCourses.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Course Registration
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
          <TextField
            select
            label="Term"
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            SelectProps={{ native: false }}
          >
            <option value="">-- Select term --</option>
            {TERMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </TextField>

          <TextField
            label="Search by code or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1 }}
          />

          <Box>
            <Chip label={`Selected: ${registered.length}`} color={registered.length < 2 ? 'warning' : 'primary'} />
          </Box>
        </Box>

        {message && (
          <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Available Courses ({filtered.length})
            </Typography>
            <Grid container spacing={2}>
              {filtered.map((course) => (
                <Grid item xs={12} sm={6} key={course.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{course.code}</Typography>
                      <Typography color="textSecondary">{course.name}</Typography>
                      <Typography variant="body2">Term: {course.term}</Typography>
                      <Typography variant="body2">Credits: {course.credits}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleAdd(course)} disabled={registered.find(c => c.id === course.id) || registered.length >= 5}>
                        Add
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Your Selection
            </Typography>
            {registered.length === 0 ? (
              <Typography variant="body2">No courses selected yet.</Typography>
            ) : (
              <Grid container spacing={1}>
                {registered.map((course) => (
                  <Grid item xs={12} key={course.id}>
                    <Card>
                      <CardContent>
                        <Typography variant="subtitle1">{course.code} — {course.name}</Typography>
                        <Typography variant="body2">Credits: {course.credits}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" color="error" onClick={() => handleRemove(course)}>Remove</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2">
                Note: You must select at least 2 and at most 5 courses per term. Submitting is simulated and saved locally.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default CourseRegistration;
