import { Plus, Search, LogOut, Compass } from 'lucide-react';
import { StickyNote as EventNoteIcon } from 'lucide-react';
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
  Paper,
  InputAdornment,
} from '@mui/material';

const MyEventsPage = () => {
  const { isAuthenticated, logout } = useAuth();
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
    logout();
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
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="sticky" sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <EventNoteIcon color="#0052cc" style={{ marginRight: '16px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'text.primary' }}>
            EventBoard
          </Typography>
          <Button startIcon={<Compass size={18} />} sx={{ mr: 1 }} onClick={() => navigate('/discover')}>
            Discover
          </Button>
          <IconButton onClick={handleLogout}>
            <LogOut size={20} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            My Events
          </Typography>
          <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => setOpenCreateModal(true)}>
            Create Event
          </Button>
        </Box>

        <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 2, border: '1px solid #dfe1e6' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                placeholder="Search by event title..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search size={20} color="#6b778c" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                  <MenuItem value="all">All Statuses</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Event List / Loading / Empty State */}
        {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredEvents.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
              <EventNoteIcon size={120} color="text.secondary" style={{ opacity: 0.5, marginBottom: '16px' }} />
              <Typography variant="h5" color="text.primary" gutterBottom sx={{ fontWeight: 600, mt: 2 }}>
                No Events to Display
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                It looks like you haven't created any events yet.
              </Typography>
              <Button variant="contained" onClick={() => setOpenCreateModal(true)}>
                Create Your First Event
              </Button>
            </Box>
          ) : (
            <EventList events={filteredEvents} onEventUpdated={onEventUpdated} onEventDeleted={onEventDeleted} />
          )}

      </Container>
      {/* Modals remain the same */}
      {openCreateModal && (
        <Dialog open={openCreateModal} onClose={() => setOpenCreateModal(false)} TransitionComponent={Slide} maxWidth="sm" fullWidth>
            <CreateEventForm onEventCreated={onEventCreated} onClose={() => setOpenCreateModal(false)} />
        </Dialog>
      )}
    </Box>
  );
};

export default MyEventsPage;