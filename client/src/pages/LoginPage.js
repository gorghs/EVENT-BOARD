import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Alert,
  Grid,
  CircularProgress,
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/my-events');
    } catch (error) {
      setErrorMessage('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #009688 100%)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
          <Box textAlign="center">
            <EventIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              EventBoard
            </Typography>
            <Typography variant="h5">
              Your new home for event management.
            </Typography>
          </Box>
      </Grid>
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box>
              <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Sign In
              </Typography>

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                  {errorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setEmail('alice@example.com');
                    setPassword('password');
                  }}
                >
                  Use Demo Credentials
                </Button>
              </Box>
            </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
