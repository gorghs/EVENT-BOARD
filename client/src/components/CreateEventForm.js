import React, { useState } from 'react';
import api from '../api/api';
import {
  Button,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from '@mui/material';

const CreateEventForm = React.forwardRef(({ onEventCreated, onClose, TransitionComponent }, ref) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('draft');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      const payload = { title, description, location, status, date: new Date(date).toISOString() };
      const response = await api.post('/api/events', payload);
      onEventCreated(response.data);
      onClose();
    } catch (error) {
      const msg = error?.response?.data?.details?.join(' ') || error?.response?.data?.error || 'Failed to create event';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={true} // This component is always open when rendered inside the Modal in MyEventsPage
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      maxWidth="sm"
      fullWidth
      PaperProps={{ ref: ref }} // Attach ref to PaperProps
    >
      <DialogTitle sx={{ fontWeight: 600 }}>Create New Event</DialogTitle>
      <DialogContent>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        
        <Box sx={{ mt: 1 }}>
          <TextField fullWidth label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={4} sx={{ mb: 2 }} />
          <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ mb: 2 }} />
          <TextField fullWidth label="Date & Time" type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
          
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
        <Button onClick={handleSubmit} variant="contained" disabled={loading} startIcon={loading ? <CircularProgress size={20} /> : null}>
          {loading ? 'Creating...' : 'Create Event'}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default CreateEventForm;
