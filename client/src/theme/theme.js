import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0052cc', // A strong, professional Atlassian Blue
      light: '#4c8cff',
      dark: '#002a9a',
    },
    secondary: {
      main: '#ffab00', // A warm, energetic Amber for accents
      contrastText: '#000',
    },
    background: {
      default: '#f4f5f7', // A subtle, soft grey background
      paper: '#ffffff',
    },
    text: {
      primary: '#172b4d', // A dark, readable navy blue
      secondary: '#6b778c', // A softer grey for secondary text
    },
    action: {
      active: '#42526e',
    },
    success: {
      main: '#36b37e',
    },
    warning: {
      main: '#ffab00',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Inter", "system-ui", "Avenir", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8, // A modern, slightly rounded corner radius
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderBottom: '1px solid #dfe1e6',
        },
      },
    },
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                backgroundColor: '#fafbfc',
                "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: '#0052cc',
                },
            }
        }
    }
  },
});

export default theme;