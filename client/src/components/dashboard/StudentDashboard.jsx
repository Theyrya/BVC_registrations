import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TERMS } from '../../data/mockData';

const StudentDashboard = () => {
  const [selectedTerm, setSelectedTerm] = useState('');
  
  // Mock student data (replace with actual data from backend)
  const studentData = {
    firstName: 'John',
    lastName: 'Doe',
    studentId: 'BVC123456',
    program: 'Software Development - Diploma',
    department: 'SD',
    registeredCourses: [
      {
        code: 'SODV2201',
        name: 'Web Programming',
        term: 'Winter',
        credits: 3
      }
    ]
  };

  const handleTermChange = (event) => {
    setSelectedTerm(event.target.value);
  };
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    if (!selectedTerm) return;
    navigate(`/course-registration?term=${encodeURIComponent(selectedTerm)}`);
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Student Information Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Name:</strong> {studentData.firstName} {studentData.lastName}
              </Typography>
              <Typography variant="body1">
                <strong>Student ID:</strong> {studentData.studentId}
              </Typography>
              <Typography variant="body1">
                <strong>Program:</strong> {studentData.program}
              </Typography>
              <Typography variant="body1">
                <strong>Department:</strong> {studentData.department}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Term Selection Card */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Course Registration
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Select Term</InputLabel>
              <Select
                value={selectedTerm}
                label="Select Term"
                onChange={handleTermChange}
              >
                {TERMS.map((term) => (
                  <MenuItem key={term} value={term}>
                    {term}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                disabled={!selectedTerm}
                onClick={handleRegisterClick}
              >
                Register for Courses
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Registered Courses Card */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Currently Registered Courses
            </Typography>
            <Grid container spacing={2}>
              {studentData.registeredCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course.code}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">
                        {course.code}
                      </Typography>
                      <Typography color="textSecondary">
                        {course.name}
                      </Typography>
                      <Typography variant="body2">
                        Term: {course.term}
                      </Typography>
                      <Typography variant="body2">
                        Credits: {course.credits}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard;
