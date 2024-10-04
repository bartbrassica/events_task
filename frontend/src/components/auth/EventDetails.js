import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid2 } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { fetchEvent, fetchEventParticipants, removeParticipantFromEvent } from './api';
import AddParticipantToEvent from './AddParticipantToEvent';
import ModalWithForm from './ModalWithForm';
import ConfirmationModal from './ConfirmationModal';

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

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
    console.log('Edit submit data:', data);
    setEditModalOpen(false);
    refreshParticipants();
  };

  const participantFormFields = [
    { label: 'Days in Event', name: 'days_in_event', type: 'number', defaultValue: selectedParticipant?.days_in_event },
    { label: 'Is Event Organizer', name: 'is_event_organizer', type: 'checkbox', defaultValue: selectedParticipant?.is_event_organizer }
  ];

  if (!event) {
    return <Typography>Loading event details...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 3 }}>{event.name}</Typography>

      <Grid2 container spacing={2} sx={{ mb: 4 }}>
        <Grid2 item xs={12} md={6}>
          <Typography variant="body1"><strong>Location:</strong> {event.location}</Typography>
        </Grid2>
        <Grid2 item xs={12} md={6}>
          <Typography variant="body1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</Typography>
        </Grid2>
        <Grid2 item xs={12} md={6}>
          <Typography variant="body1"><strong>Duration:</strong> {event.duration} days</Typography>
        </Grid2>
        <Grid2 item xs={12}>
          <Typography variant="body1"><strong>Description:</strong> {event.description}</Typography>
        </Grid2>
      </Grid2>

      <AddParticipantToEvent eventId={eventId} eventDuration={event.duration} onParticipantAdded={refreshParticipants} />

      <Typography variant="h5" sx={{ mb: 2 }}>Event Participants</Typography>
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
                  <IconButton color="default">
                    <InfoIcon />
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
        description={`Are you sure you want to delete ${selectedParticipant?.id} ${selectedParticipant?.participant?.first_name} ${selectedParticipant?.participant?.last_name} from this event?`}
      />
    </Container>
  );
}

export default EventDetails;
