import React, { useState } from 'react';
import EditEventForm from './EditEventForm';
import api from '../api/api';
import {
  Typography,
  Paper,
  Grid,
  Button,
  Box,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Public as PublicIcon,
  Drafts as DraftIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
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

  const getStatusChip = (status) => (
    <Chip
      icon={status === 'published' ? <PublicIcon /> : <DraftIcon />}
      label={status}
      color={status === 'published' ? 'success' : 'default'}
      size="small"
      variant="outlined"
    />
  );

  return (
    <>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2, transition: 'all 0.3s', '&:hover': { boxShadow: 3 } }}>
        <Box sx={{ width: { xs: '100%', sm: 100 }, height: 100, borderRadius: 1, bgcolor: 'primary.main', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>{format(new Date(event.date), 'dd')}</Typography>
          <Typography variant="body1">{format(new Date(event.date), 'MMM')}</Typography>
        </Box>

        <Box sx={{ flexGrow: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600, mb: 1 }}>{event.title}</Typography>
            {getStatusChip(event.status)}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{format(new Date(event.date), 'MMM dd, yyyy • h:mm a')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
            <LocationIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{event.location || 'Not specified'}</Typography>
          </Box>
        </Box>

        <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={openMenu ? 'long-menu' : undefined}
            aria-expanded={openMenu ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button',
            }}
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                maxHeight: 48 * 4.5,
                width: '20ch',
              },
            }}
          >
            <MenuItem onClick={handleEditClick}>
              <EditIcon sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={handleDeleteClick}>
              <DeleteIcon sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      </Paper>

      {/* Edit Modal */}
      {editModalOpen && (
        <EditEventForm 
          event={event} 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
          onEventUpdated={onEventUpdated} 
          TransitionComponent={Slide}
        />
      )}

      {/* Delete Confirmation Dialog */}
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