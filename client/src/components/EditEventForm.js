import React, { useState, useEffect, useRef } from 'react';
import api from '../api/api';
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const EditEventForm = React.forwardRef(({ event, open, onClose, onEventUpdated, TransitionComponent }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const initialEventState = useRef(null);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setLocation(event.location || '');
      setStatus(event.status || 'draft');
      if (event.date) {
        const d = new Date(event.date);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISO = new Date(d - tzOffset).toISOString().slice(0, 16);
        setDate(localISO);
      }
      initialEventState.current = {
        title: event.title || '',
        description: event.description || '',
        location: event.location || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        status: event.status || 'draft',
      };
      setHasChanges(false);
    }
  }, [event]);

  useEffect(() => {
    if (initialEventState.current) {
      const currentFormState = {
        title,
        description,
        location,
        date,
        status,
      };
      const changed = Object.keys(currentFormState).some(key => {
        if (key === 'date') {
          const initialDate = new Date(initialEventState.current.date).getTime();
          const currentDate = new Date(currentFormState.date).getTime();
          return initialDate !== currentDate;
        }
        return initialEventState.current[key] !== currentFormState[key];
      });
      setHasChanges(changed);
    }
  }, [title, description, location, date, status]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
    const payload = { title, description, location, status, date: new Date(date).toISOString() };
    const response = await api.patch(`/api/events/${event.id}`, payload);

    onEventUpdated(response.data);
    onClose();
    } catch (error) {
      const msg = error?.response?.data?.error || 'Failed to update event';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      maxWidth="sm"
      fullWidth
      PaperProps={{ ref: ref }} // Attach ref to PaperProps
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Edit Event</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        
        <Box component="form" id="edit-event-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField fullWidth label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} sx={{ mb: 2 }} />
          <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Date & Time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} sx={{ mb: 3 }} InputLabelProps={{ shrink: true }} />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Status</InputLabel>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" disabled={loading}>Cancel</Button>
        <Button type="submit" form="edit-event-form" variant="contained" disabled={loading || !hasChanges} startIcon={loading ? <CircularProgress size={20} /> : null}>
          {loading ? 'Updating...' : 'Update Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default EditEventForm;