import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Container,
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
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <EventIcon sx={{ fontSize: 60, mb: 2, color: 'accent.main' }} />
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          EventBoard
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Sign in to your account
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {errorMessage}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: '100%' }}>
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
            color="primary"
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
    </Container>
  );
};

export default LoginPage;