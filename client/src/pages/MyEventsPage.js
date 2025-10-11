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
  Paper,
  Grid,
  Modal,
  Skeleton,
  Slide,
  Dialog,
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

  const onEventUpdated = (oldId, newEvent) => {
    setEvents(prevEvents => [newEvent, ...prevEvents.filter(event => event.id !== oldId)]);
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

  const renderSkeletons = () => (
    <Grid container spacing={3}>
      {Array.from(new Array(3)).map((_, index) => (
        <Grid item xs={12} key={index}>
          <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Skeleton variant="rectangular" width={80} height={80} />
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
            <Skeleton variant="circular" width={40} height={40} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
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
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>My Events</Typography>
              <Typography variant="subtitle1" color="text.secondary">Manage and track your events.</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateModal(true)}>Create Event</Button>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
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
        </Paper>

        <Box>
            {loading ? (
              renderSkeletons()
            ) : filteredEvents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <EventIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
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
