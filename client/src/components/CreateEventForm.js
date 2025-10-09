
import React, { useState } from 'react';
import api from '../api/api';
import {
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CreateEventForm = ({ onEventCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState('draft');
  const [errorMessage, setErrorMessage] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (!title || title.trim().length < 3) {
        setErrorMessage('Title must be at least 3 characters.');
        return;
      }
      if (!date) {
        setErrorMessage('Please select a date and time.');
        return;
      }
      const token = localStorage.getItem('token');
      const isoDate = new Date(date).toISOString();
      const payload = { title, description, date: isoDate, location, status };
      const response = await api.post('/api/events', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onEventCreated(response.data);
      handleClose();
    } catch (error) {
      const details = error?.response?.data?.details;
      const msg = (Array.isArray(details) && details.join(' ')) || error?.response?.data?.error || 'Failed to create event';
      setErrorMessage(msg);
      console.error('Failed to create event', error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mb: 4 }}>
        Create New Event
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Create Event
          </Typography>
          {errorMessage && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errorMessage}
            </Typography>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              multiline
              rows={4}
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              label="Date"
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              fullWidth
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default CreateEventForm;
