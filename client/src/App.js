import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import MyEventsPage from './pages/MyEventsPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/" element={<MyEventsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;