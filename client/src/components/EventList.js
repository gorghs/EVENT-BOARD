import React from 'react';
import EventCard from './EventCard';
import {
  Grid,
} from '@mui/material';

const EventList = ({ events, onEventUpdated, onEventDeleted }) => {
  return (
    <Grid container spacing={3}>
      {events.map((event) => (
        <Grid item xs={12} key={event.id}>
          <EventCard 
            event={event} 
            onEventUpdated={onEventUpdated} 
            onEventDeleted={onEventDeleted} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default EventList;