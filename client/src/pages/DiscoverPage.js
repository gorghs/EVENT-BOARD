import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CardHeader,
  Chip,
  Skeleton,
  Alert,
  Button,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, Explore as ExploreIcon } from '@mui/icons-material';

const DiscoverPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/events/public-events');
        setEvents(response.data);
      } catch (err) {
        console.error('Failed to fetch public events', err);
        setError('Failed to load public events. The API might be down or rate-limited.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEvents();
  }, []);

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Card elevation={2}>
            <CardHeader
              avatar={<Skeleton animation="wave" variant="circular" width={40} height={40} />}
              title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
              subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <CardContent>
              <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
              <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f4f6f8' }}>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)' }}
      >
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/my-events')}>
            <ArrowBackIcon />
          </IconButton>
          <ExploreIcon sx={{ mx: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Discover Events
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          renderSkeleton()
        ) : (
          <Grid container spacing={3}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={`${event.external_id}-${event.source}`}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 2, transition: '0.3s', '&:hover': { boxShadow: 6 } }}>
                  <CardHeader
                    title={<Typography variant="h6" sx={{ fontWeight: 600 }}>{event.title}</Typography>}
                    subheader={`Source: ${event.source}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                    <Chip label={new Date(event.date).toLocaleDateString()} size="small" />
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                     <Button fullWidth variant="outlined" disabled>Learn More</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default DiscoverPage;