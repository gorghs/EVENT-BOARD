
import React, { useState, useEffect } from 'react';
import api from '../api/api';
import {
  Button,
  TextField,
  Box,
  Typography,
  Modal,
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

const EditEventForm = ({ event, onEventUpdated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
    }
  }, [event]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await api.patch(`/api/events/${event.id}`, { title, description }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onEventUpdated(response.data);
      handleClose();
    } catch (error) {
      console.error('Failed to update event', error);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpen} sx={{ mr: 1 }}>Edit</Button>
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Edit Event
          </Typography>
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
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default EditEventForm;
