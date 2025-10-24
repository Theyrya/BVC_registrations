import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material';
import { programs } from '../../data/mockData';

const ProgramList = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Available Programs
      </Typography>
      <Grid container spacing={3}>
        {programs.map((program) => (
          <Grid item xs={12} md={6} key={program.id}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {program.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  Program Code: {program.code}
                </Typography>
                <Typography variant="body1" paragraph>
                  {program.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Duration:</strong> {program.duration}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Term:</strong> {program.term}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Start Date:</strong> {new Date(program.startDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    <strong>End Date:</strong> {new Date(program.endDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Fees:</strong>
                  </Typography>
                  <Typography variant="body2">
                    Domestic: ${program.fees.domestic.toLocaleString()}
                  </Typography>
                  <Typography variant="body2">
                    International: ${program.fees.international.toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProgramList;
