import React from 'react';
import api from '../api/api';
import EditEventForm from './EditEventForm';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
} from '@mui/material';

const EventList = ({ events, setEvents, onDelete }) => {
  const onEventUpdated = (updatedEvent) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  }

  return (
    <Grid container spacing={2}>
      {events.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <Card>
            <CardContent>
              <Typography variant="h5">{event.title}</Typography>
              <Typography variant="body2">{event.description}</Typography>
              <Box sx={{ mt: 2 }}>
                <EditEventForm event={event} onEventUpdated={onEventUpdated} />
                <Button variant="contained" color="secondary" onClick={() => onDelete(event.id)}>Delete</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;