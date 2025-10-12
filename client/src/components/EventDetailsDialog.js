import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { CalendarToday, LocationOn } from '@mui/icons-material';

const EventDetailsDialog = ({ event, open, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event.title}</DialogTitle>
      <DialogContent dividers>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Source: {event.source}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {event.description}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body1">
            {new Date(event.date).toLocaleString()}
          </Typography>
        </Box>
        {event.location && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1">{event.location}</Typography>
          </Box>
        )}
        {event.url && (
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" href={event.url} target="_blank" rel="noopener noreferrer">
                    View on {event.source}
                </Button>
            </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsDialog;