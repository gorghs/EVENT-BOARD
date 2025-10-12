import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import api from '../api/api';
import EventList from '../components/EventList';
import CreateEventForm from '../components/CreateEventForm';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  CircularProgress,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Dialog,
  Slide,
} from '@mui/material';
import {
  Event as EventIcon,
  Explore as ExploreIcon,
  Logout as LogoutIcon,
  Add as AddIcon,
} from '@mui/icons-material';

const MyEventsPage = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openCreateModal, setOpenCreateModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.get('/api/events').then(response => {
        setEvents(response.data.events || []);
      }).catch(error => {
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]);
    setOpenCreateModal(false);
  };

    const onEventUpdated = (updatedEvent) => {
        setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    };

  const onEventDeleted = (deletedId) => {
    setEvents(events.filter(event => event.id !== deletedId));
  };

  const filteredEvents = events.filter(event => {
    const searchTermMatch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const statusFilterMatch = statusFilter === 'all' || event.status === statusFilter;
    return searchTermMatch && statusFilterMatch;
  });

  if (!isAuthenticated) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <EventIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            EventBoard
          </Typography>
          <Button color="inherit" startIcon={<ExploreIcon />} onClick={() => navigate('/discover')} sx={{ mr: 1 }}>
            Discover
          </Button>
          <IconButton color="inherit" onClick={handleLogout}><LogoutIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>My Events</Typography>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)}>Create Event</Button>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
          <TextField
            label="Search Events"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="published">Published</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box>
            {loading ? (
              <CircularProgress />
            ) : filteredEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <EventIcon sx={{ fontSize: 80, color: 'accent.main', mb: 2 }} />
                <Typography variant="h5" color="text.secondary">No events found</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'Create your first event to get started!'}
                </Typography>
                <Button variant="contained" onClick={() => setOpenCreateModal(true)}>Create Event</Button>
              </Box>
            ) : (
              <EventList events={filteredEvents} onEventUpdated={onEventUpdated} onEventDeleted={onEventDeleted} />
            )}
          </Box>
      </Container>

      {openCreateModal && (
        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)}>
          <CreateEventForm onEventCreated={onEventCreated} onClose={() => setOpenCreateModal(false)} TransitionComponent={Slide} />
        </Dialog>
      )}
    </Box>
  );
};

export default MyEventsPage;