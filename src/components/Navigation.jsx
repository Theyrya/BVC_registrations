import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Navigation = ({ isAuthenticated, isAdmin, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          BVC Registration
        </Typography>
        <Box>
          {!isAuthenticated ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/programs"
              >
                Programs
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/courses"
              >
                Courses
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/signup"
              >
                Sign Up
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/login"
              >
                Login
              </Button>
            </>
          ) : isAdmin ? (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/dashboard"
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/courses"
              >
                Manage Courses
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/students"
              >
                View Students
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/admin/messages"
              >
                Messages
              </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={RouterLink}
                to="/dashboard"
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
              >
                Profile
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/course-registration"
              >
                Register Courses
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/contact"
              >
                Contact Admin
              </Button>
                <Button
                  color="inherit"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
