import { createTheme } from '@mui/material/styles';

// A modern and sophisticated theme for a premium look and feel.
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1A202C', // Almost Black
    },
    secondary: {
      main: '#2D3748', // Dark Gray
    },
    accent: {
      main: '#38B2AC', // Teal
    },
    background: {
      default: '#F7FAFC', // Very Light Gray
      paper: '#ffffff',
    },
    text: {
      primary: '#1A202C', // Almost Black
      secondary: '#718096', // Gray
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '3rem' },
    h2: { fontWeight: 700, fontSize: '2.5rem' },
    h3: { fontWeight: 600, fontSize: '2rem' },
    h4: { fontWeight: 600, fontSize: '1.75rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          backgroundColor: '#F7FAFC',
          borderBottom: '1px solid #E2E8F0',
          color: '#1A202C',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 28px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: '1px solid #E2E8F0',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            borderColor: 'transparent',
            transform: 'translateY(-6px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
    MuiModal: {
      styleOverrides: {
        root: {
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(26, 32, 44, 0.7)',
            backdropFilter: 'blur(8px)',
          },
        },
      },
    },
  },
});

export default theme;