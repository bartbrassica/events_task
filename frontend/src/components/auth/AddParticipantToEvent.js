import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, Grid2 } from '@mui/material';
import ModalWithForm from './ModalWithForm';
import { fetchParticipants, addParticipantToEvent, createParticipant } from './api';

function AddParticipantToEvent({ eventId, eventDuration, onParticipantAdded }) {
  const [participants, setParticipants] = useState([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState('');
  const [daysInEvent, setDaysInEvent] = useState('');
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAddParticipantModalOpen, setAddParticipantModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const getParticipants = async () => {
      try {
        const data = await fetchParticipants();
        setParticipants(data);
      } catch (error) {
        console.error('Failed to fetch participants:', error);
      }
    };
    getParticipants();
  }, []);

  const handleAddParticipant = async () => {
    try {
      const formData = { 
        participant_id: selectedParticipantId, 
        days_in_event: daysInEvent, 
        is_event_organizer: isOrganizer, 
        event_id: eventId 
      };
      await addParticipantToEvent(eventId, formData);
      onParticipantAdded();
    } catch (error) {
      console.error('Failed to add participant to event:', error);
    }
  };

  const handleCreateParticipant = async (data) => {
    try {
      const newParticipant = await createParticipant(data);
      setParticipants([...participants, newParticipant]);
      setSelectedParticipantId(newParticipant.id);
      setAddParticipantModalOpen(false);
    } catch (error) {
      console.error('Failed to create new participant:', error);
    }
  };

  const validateDaysInEvent = (value) => {
    const parsedValue = parseInt(value, 10);
    if (parsedValue <= 0 || parsedValue > eventDuration) {
      setError(`Days in event must be greater than 0 and less than or equal to ${eventDuration}`);
    } else {
      setError('');
    }
    setDaysInEvent(parsedValue);
  };

  const participantFormFields = [
    { label: 'First Name', name: 'first_name' },
    { label: 'Last Name', name: 'last_name' },
    { label: 'Email', name: 'email', type: 'email' },
    { label: 'Is Vegetarian', name: 'is_vegetarian', type: 'checkbox' },
  ];

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" sx={{ my: 2 }}>Add Participant to Event</Typography>
      
      <Grid2 container spacing={2} direction="column" alignItems="stretch">
        <Grid2 item xs={12} container spacing={2} alignItems="center">
          <Grid2 item xs={9}>
            <Typography>Select Participant:</Typography>
            <Select
              fullWidth
              value={selectedParticipantId}
              onChange={(e) => setSelectedParticipantId(e.target.value)}
              displayEmpty
            >
              <MenuItem value="" disabled>Select a participant</MenuItem>
              {participants.map((participant) => (
                <MenuItem key={participant.id} value={participant.id}>
                  {participant.first_name} {participant.last_name} ({participant.email})
                </MenuItem>
              ))}
            </Select>
          </Grid2>

          <Grid2 item xs={3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => setAddParticipantModalOpen(true)}
              sx={{ mb: 1, height: '100%' }}
            >
              Add New Participant
            </Button>
          </Grid2>
        </Grid2>

        <Grid2 item xs={12}>
          <TextField
            label="Days in Event"
            type="number"
            fullWidth
            value={daysInEvent}
            onChange={(e) => validateDaysInEvent(e.target.value)}
            error={!!error}
            helperText={error}
          />
        </Grid2>

        <Grid2 item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isOrganizer}
                onChange={(e) => setIsOrganizer(e.target.checked)}
              />
            }
            label="Is Event Organizer"
          />
        </Grid2>

        <Grid2 item xs={12}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleAddParticipant}
            disabled={!selectedParticipantId || !!error}
            fullWidth
          >
            Add Participant to Event
          </Button>
        </Grid2>
      </Grid2>

      <ModalWithForm
        open={isAddParticipantModalOpen}
        onClose={() => setAddParticipantModalOpen(false)}
        onSubmit={handleCreateParticipant}
        fields={participantFormFields}
      />
    </Container>
  );
}

export default AddParticipantToEvent;
