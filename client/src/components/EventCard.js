import { Calendar, Clock, MapPin, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { CheckCircle, EditNote } from '@mui/icons-material';
import React, { useState } from 'react';
import EditEventForm from './EditEventForm';
import api from '../api/api';
import {
  Typography,
  Paper,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Menu,
  MenuItem,
} from '@mui/material';
import { format } from 'date-fns';

const EventCard = ({ event, onEventUpdated, onEventDeleted }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/api/events/${event.id}`);
      onEventDeleted(event.id);
      setDeleteDialogOpen(false);
    } catch (error) {
    }
  };

const getStatusStyles = (status) => {
  if (status === 'published') {
    return {
      borderColor: 'success.main',
      chipColor: 'success',
      icon: <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
    };
  }
  return {
    borderColor: 'warning.main',
    chipColor: 'warning',
    icon: <EditNote sx={{ color: 'warning.main', fontSize: 20 }} />
  };
};


return (
  <>
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        borderRadius: 2,
        border: '1px solid #dfe1e6',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(23, 43, 77, 0.1)',
          borderColor: 'primary.main',
        },
      }}
    >
      <Box sx={{
        borderRight: '1px solid #dfe1e6',
        p: 2.5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minWidth: 100,
      }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700 }}>
          {format(new Date(event.date), 'dd')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase' }}>
          {format(new Date(event.date), 'MMM')}
        </Typography>
      </Box>

      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getStatusStyles(event.status).icon}
            <Typography variant="h6" component="h2" sx={{ ml: 1, fontWeight: 600 }}>
              {event.title}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, color: 'text.secondary', flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar size={14} />
              <Typography variant="body2">{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Clock size={14} />
              <Typography variant="body2">{format(new Date(event.date), 'p')}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MapPin size={14} />
              <Typography variant="body2">{event.location || 'Online'}</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ ml: 1 }}>
          <IconButton onClick={handleMenuClick}>
            <MoreVertical size={20} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
            <MenuItem onClick={handleEditClick}>
              <Edit size={16} style={{ marginRight: '8px' }}/> Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
              <Trash2 size={16} style={{ marginRight: '8px' }}/> Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Paper>

    {/* Modals remain unchanged */}
    {editModalOpen && (
        <EditEventForm 
          event={event} 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          onEventUpdated={onEventUpdated} 
          TransitionComponent={Slide}
        />
    )}
    <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" TransitionComponent={Slide}>
        <DialogTitle>Delete Event</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete "{event.title}"? This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
    </Dialog>
  </>
);
};

export default EventCard;