import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
         Paper, IconButton, Button, Grid2, Modal, Box, Select, MenuItem, Card, CardContent } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { fetchEvent, fetchEventParticipants, fetchMealsForEvent, removeParticipantFromEvent,
         addParticipantMealsToEvent, fetchParticipantMealsOnEvent, updateEventParticipant } from './api';
import AddParticipantToEvent from './AddParticipantToEvent';
import ModalWithForm from './ModalWithForm';
import ConfirmationModal from './ConfirmationModal';

function EventDetails() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isMealsModalOpen, setMealsModalOpen] = useState(false);
  const [meals, setMeals] = useState([]);
  const [participantMeals, setParticipantMeals] = useState([]);

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const eventData = await fetchEvent(eventId);
        setEvent(eventData);

        const participantsData = await fetchEventParticipants(eventId);
        setParticipants(participantsData);
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };

    getEventDetails();
  }, [eventId]);

  const refreshParticipants = async () => {
    try {
      const participantsData = await fetchEventParticipants(eventId);
      setParticipants(participantsData);
    } catch (error) {
      console.error('Failed to fetch participants:', error);
    }
  };

  const handleEditParticipant = (event_participant) => {
    setSelectedParticipant(event_participant);
    setEditModalOpen(true);
  };

  const handleDeleteParticipant = (event_participant) => {
    setSelectedParticipant(event_participant);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteParticipant = async () => {
    try {
      await removeParticipantFromEvent(eventId, selectedParticipant.id);
      refreshParticipants();
      setDeleteConfirmOpen(false);
      setSelectedParticipant(null);
    } catch (error) {
      console.error('Failed to delete participant from event:', error);
    }
  };

  const handleEditSubmit = async (data) => {
    const updatedData = {
      ...data, event_id: eventId, participant_id: selectedParticipant.id
    }
    try {
      await updateEventParticipant(eventId, selectedParticipant.id, data);
  
      setEditModalOpen(false);
      refreshParticipants();
    } catch (error) {
      console.error('Failed to update participant:', error);
    }
  };

  const handleShowMeals = async (participant) => {
    setSelectedParticipant(participant);
    try {
      const mealsData = await fetchMealsForEvent(eventId);
      setMeals(mealsData);
      
      const participantMealsData = await fetchParticipantMealsOnEvent(eventId, participant.participant.id);
    
  
      const initialMeals = Array(participant.days_in_event).fill(null).map((_, index) => {
        const mealsForDay = participantMealsData
          .filter(meal => meal.day === index + 1)
          .map(meal => ({
            ...meal,
            meal_type: mealsData.find(m => m.id === meal.meal_id)?.meal_type || ''
          }));
        
        return {
          breakfast: mealsForDay.find(m => m.meal_type.toLowerCase() === 'breakfast')?.meal_id || '',
          lunch: mealsForDay.find(m => m.meal_type.toLowerCase() === 'lunch')?.meal_id || '',
          dinner: mealsForDay.find(m => m.meal_type.toLowerCase() === 'dinner')?.meal_id || '',
        };
      });
  
      setParticipantMeals(initialMeals);
  
      setMealsModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch meals for event:', error);
    }
  };

  const handleMealChange = (dayIndex, mealType, mealId) => {
    setParticipantMeals((prevMeals) =>
      prevMeals.map((dayMeals, index) =>
        index === dayIndex ? { ...dayMeals, [mealType]: mealId } : dayMeals
      )
    );
  };

  const saveParticipantMeals = async () => {
    try {
      const formattedMeals = participantMeals.map((meal, index) => {
        return [
          {
            meal_id: meal.breakfast,
            participant_id: selectedParticipant.id,
            day: index + 1,
            is_special_request: false,
          },
          {
            meal_id: meal.lunch,
            participant_id: selectedParticipant.id,
            day: index + 1,
            is_special_request: false,
          },
          {
            meal_id: meal.dinner,
            participant_id: selectedParticipant.id,
            day: index + 1,
            is_special_request: false,
          }
        ].filter((m) => m.meal_id);
      }).flat();
      const payload = {
        meals: formattedMeals
      };
      const response = addParticipantMealsToEvent(eventId,selectedParticipant.id, payload);
      setMealsModalOpen(false);
    } catch (error) {
      console.error('Failed to save participant meals:', error);
    }
  };

  const participantFormFields = [
    { label: 'Days in Event', name: 'days_in_event', type: 'number', defaultValue: selectedParticipant?.days_in_event },
    { label: 'Is Event Organizer', name: 'is_event_organizer', type: 'checkbox', defaultValue: selectedParticipant?.is_event_organizer }
  ];

  const filterMealsByType = (type) => {
    const filteredMeals = meals.filter(meal => 
      meal.meal_type.toLowerCase() === type.toLowerCase() &&
      (!selectedParticipant?.participant.is_vegetarian || meal.is_vegetarian)
    );
    return filteredMeals
  };

  if (!event) {
    return <Typography>Loading event details...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 3, textAlign: 'center', color: 'primary.main' }}>{event.name}</Typography>

      <Card variant="outlined" sx={{ mb: 4, borderRadius: '8px', borderColor: 'primary.main', boxShadow: 2 }}>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Location:</Typography>
                <Typography variant="body2">{event.location}</Typography>
              </Box>
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Date:</Typography>
                <Typography variant="body2">{new Date(event.date).toLocaleDateString()}</Typography>
              </Box>
            </Grid2>
            <Grid2 item xs={12} md={6}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Duration:</Typography>
                <Typography variant="body2">{event.duration} days</Typography>
              </Box>
            </Grid2>
            <Grid2 item xs={12}>
              <Box sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Description:</Typography>
                <Typography variant="body2">{event.description}</Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(`/events/${eventId}/meals`)}
        sx={{ textTransform: 'none', borderRadius: '20px', padding: '8px 16px' }}
      >
        View Meals
      </Button>

      <AddParticipantToEvent eventId={eventId} eventDuration={event.duration} onParticipantAdded={refreshParticipants} />

      <Typography variant="h4" sx={{ my: 3, textAlign: 'center', color: 'primary.main' }}>Event Participants</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Is Organizer?</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((event_participant) => (
              <TableRow key={event_participant.id}>
                <TableCell>{event_participant.participant.first_name}</TableCell>
                <TableCell>{event_participant.participant.last_name}</TableCell>
                <TableCell>{event_participant.participant.email}</TableCell>
                <TableCell>{event_participant.is_event_organizer ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditParticipant(event_participant)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDeleteParticipant(event_participant)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="default" onClick={() => handleShowMeals(event_participant)}>
                    <RestaurantIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalWithForm
        open={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        fields={participantFormFields}
        selectedRecord={selectedParticipant}
      />

      <ConfirmationModal
        open={isDeleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDeleteParticipant}
        title="Delete Participant"
        description={`Are you sure you want to delete ${selectedParticipant?.participant?.first_name} ${selectedParticipant?.participant?.last_name} from this event?`}
      />

      <Modal open={isMealsModalOpen} onClose={() => setMealsModalOpen(false)}>
        <Box sx={{ p: 4, bgcolor: 'white', width: '500px', margin: 'auto', mt: '10%', maxHeight: '80vh', overflowY: 'auto' }}>
          <Typography variant="h6">Select Meals for {selectedParticipant?.participant?.first_name}</Typography>
          {participantMeals.map((dayMeals, dayIndex) => (
            <div key={dayIndex} style={{ marginBottom: '16px' }}>
              <Typography variant="body2">Day {dayIndex + 1}:</Typography>

              <Select
                fullWidth
                value={dayMeals.breakfast}
                onChange={(e) => handleMealChange(dayIndex, 'breakfast', e.target.value)}
                displayEmpty
              >
                <MenuItem value="">Select a breakfast</MenuItem>
                {filterMealsByType('Breakfast').map((meal) => (
                  <MenuItem key={meal.id} value={meal.id}>
                    {meal.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                fullWidth
                value={dayMeals.lunch}
                onChange={(e) => handleMealChange(dayIndex, 'lunch', e.target.value)}
                displayEmpty
                sx={{ mt: 1 }}
              >
                <MenuItem value="">Select a lunch</MenuItem>
                {filterMealsByType('Lunch').map((meal) => (
                  <MenuItem key={meal.id} value={meal.id}>
                    {meal.name}
                  </MenuItem>
                ))}
              </Select>

              <Select
                fullWidth
                value={dayMeals.dinner}
                onChange={(e) => handleMealChange(dayIndex, 'dinner', e.target.value)}
                displayEmpty
                sx={{ mt: 1 }}
              >
                <MenuItem value="">Select a dinner</MenuItem>
                {filterMealsByType('Dinner').map((meal) => (
                  <MenuItem key={meal.id} value={meal.id}>
                    {meal.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          ))}
          <Button onClick={saveParticipantMeals} sx={{ mt: 2 }} variant="contained" color="primary">
            Save Meals
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default EventDetails;
