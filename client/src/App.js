import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import LoginPage from './pages/LoginPage';
import DiscoverPage from './pages/DiscoverPage';
import MyEventsPage from './pages/MyEventsPage';
// Removed RegisterPage per request

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/** Register route removed */}
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;