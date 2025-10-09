
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
} from '@mui/material';

const DiscoverPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchPublicEvents = async () => {
      try {
        const response = await api.get('/api/events/public-events');
        setEvents(response.data);
      } catch (error) {
        console.error('Failed to fetch public events', error);
      }
    };

    fetchPublicEvents();
  }, []);

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 4 }}>
        Public Events
      </Typography>
      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} sm={6} md={4} key={event.id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{event.title}</Typography>
                <Typography variant="body2">{event.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DiscoverPage;
