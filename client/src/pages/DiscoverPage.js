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
import EventDetailsDialog from '../components/EventDetailsDialog';

const DiscoverPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/events/public-events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load public events. The API might be down or rate-limited.');
      } finally {
        setLoading(false);
      }
    };

    fetchPublicEvents();
  }, []);

  const handleLearnMore = (event) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const renderSkeleton = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
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
          <Grid container spacing={4}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={`${event.external_id}-${event.source}`}>
                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
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
                     <Button fullWidth variant="contained" color="primary" onClick={() => handleLearnMore(event)}>Learn More</Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <EventDetailsDialog event={selectedEvent} open={dialogOpen} onClose={handleCloseDialog} />
    </Box>
  );
};

export default DiscoverPage;
