import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, Container } from '@mui/material';
import { StickyNote as EventNoteIcon } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, errorMessage } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/my-events');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <Box
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            borderRadius: '50%',
            p: 2,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <EventNoteIcon size={40} />
        </Box>
        <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          EventBoard
        </Typography>
        <Typography component="h2" variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Sign in to your account
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {errorMessage}
          </Alert>
        )}
        <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
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
            sx={{
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
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
      </Paper>
    </Container>
  );
};

export default LoginPage;