import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardActions, Button, IconButton, Grid2 } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ModalWithForm from './ModalWithForm';
import ConfirmationModal from './ConfirmationModal';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from './api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };
    
    getEvents();
  }, []);

  const handleFormSubmit = async (data) => {
    try {
      const date = new Date(data.date);
      date.setHours(0, 0, 0, 0);
  
      const eventData = {
        ...data,
        date: date.toISOString(),
      };
  
      if (selectedEvent) {
        await updateEvent(selectedEvent.id, eventData);
      } else {
        await createEvent(eventData);
      }

      const updatedEvents = await fetchEvents();
      setEvents(updatedEvents);

      setFormValues({});
      setModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleDeleteEvent = (event) => {
    setSelectedEvent(event);
    setConfirmModalOpen(true);
  };

  const confirmDeleteEvent = async () => {
    try {
      await deleteEvent(selectedEvent.id);
      setEvents(events.filter(event => event.id !== selectedEvent.id));
      setConfirmModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formFields = [
    { label: 'Event Name', name: 'name', defaultValue: selectedEvent?.name || formValues.name || '' },
    { label: 'Description', name: 'description', type: 'text', defaultValue: selectedEvent?.description || formValues.description || '' },
    { label: 'Location', name: 'location', defaultValue: selectedEvent?.location || formValues.location || '' },
    { label: 'Date', name: 'date', type: 'date', defaultValue: selectedEvent ? new Date(selectedEvent.date).toISOString().slice(0, 10) : formValues.date || '' },
    { label: 'Duration (days)', name: 'duration', type: 'number', defaultValue: selectedEvent?.duration || formValues.duration || 0 },
  ];

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
    setFormValues({});
  };

  if (!events) {
    return <Typography>Loading events...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 3 }}>Incoming events:</Typography>
      <Grid2 container spacing={3}>
        {events.map((event) => (
          <Grid2 item xs={12} sm={6} md={4} key={event.id}>
            <Card
              sx={{
                height: '250px',
                bgcolor: '#1976d2',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                p: 2,
              }}
            >
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 40, color: 'white' }}
                onClick={() => handleEditEvent(event)}
              >
                <EditIcon />
              </IconButton>

              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
                onClick={() => handleDeleteEvent(event)}
              >
                <DeleteIcon />
              </IconButton>

              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2">Date: {new Date(event.date).toLocaleDateString()}</Typography>
                <Typography variant="body2">Duration: {event.duration} days</Typography>
                <Typography variant="body2">Location: {event.location}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => navigate(`/events/${event.id}`)} sx={{ color: 'white' }}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid2>
        ))}

        <Grid2 item xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: '250px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              bgcolor: '#1565c0',
              color: 'white',
            }}
            onClick={() => {
              setSelectedEvent(null);
              setModalOpen(true);
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3">+</Typography>
              <Typography variant="body1">Add New Event</Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <ModalWithForm
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        fields={formFields}
        selectedRecord={selectedEvent}
      />

      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDeleteEvent}
        title="Delete Event"
        description={`Are you sure you want to delete the event "${selectedEvent?.name}"?`}
      />
    </Container>
  );
}

export default Dashboard;
