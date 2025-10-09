
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
} from '@mui/material';

const MyEventsPage = () => {
  const isAuthenticated = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/api/events', {
          headers: { Authorization: `Bearer ${token}` },
        });
        // server returns { events, total }
        setEvents(response.data.events || []);
      } catch (error) {
        console.error('Failed to fetch events', error);
      }
    };

    if (isAuthenticated) {
      fetchEvents();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onEventCreated = (newEvent) => {
    setEvents([...events, newEvent]);
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/events/${id}`);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  if (!isAuthenticated) {
    return null; // Or a loading spinner
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 4 }}>
        <Typography variant="h4">My Events</Typography>
        <Box>
          <Button variant="contained" onClick={() => navigate('/discover')} sx={{ mr: 2 }}>
            Discover Events
          </Button>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Box>
      <CreateEventForm onEventCreated={onEventCreated} />
      <EventList events={events} setEvents={setEvents} onDelete={handleDelete} />
    </Container>
  );
};

export default MyEventsPage;
