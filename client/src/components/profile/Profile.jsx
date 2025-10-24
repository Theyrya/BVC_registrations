import React, { useEffect, useState } from 'react';
import { Container, Paper, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { courses as allCourses } from '../../data/mockData';

const STORAGE_KEY = 'bvc_registrations';

const Profile = () => {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState({});

  // Mock student data for frontend-only
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: 'BVC123456',
    program: 'Software Development - Diploma',
    department: 'SD'
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      // Map ids back to course objects
      const mapped = {};
      Object.keys(parsed).forEach(term => {
        mapped[term] = (parsed[term] || []).map(id => allCourses.find(c => c.id === id)).filter(Boolean);
      });
      setRegistrations(mapped);
    } catch (e) {
      setRegistrations({});
    }
  }, []);

  const handleGoToTerm = (term) => {
    navigate(`/course-registration?term=${encodeURIComponent(term)}`);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Profile</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography><strong>Name:</strong> {studentData.firstName} {studentData.lastName}</Typography>
          <Typography><strong>Student ID:</strong> {studentData.studentId}</Typography>
          <Typography><strong>Program:</strong> {studentData.program}</Typography>
          <Typography><strong>Department:</strong> {studentData.department}</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>Registered Courses (by term)</Typography>
        {Object.keys(registrations).length === 0 && (
          <Typography variant="body2">You have no registrations saved locally yet.</Typography>
        )}

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {Object.entries(registrations).map(([term, list]) => (
            <Grid item xs={12} key={term}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1">{term} — {list.length} course(s)</Typography>
                    <Button size="small" onClick={() => handleGoToTerm(term)}>Manage</Button>
                  </Box>
                  {list.length === 0 ? (
                    <Typography variant="body2">No courses for this term.</Typography>
                  ) : (
                    list.map(c => (
                      <Box key={c.id} sx={{ mt: 1 }}>
                        <Typography>{c.code} — {c.name}</Typography>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;
