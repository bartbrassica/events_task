import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Modal, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ModalWithForm from './ModalWithForm';
import ConfirmationModal from './ConfirmationModal';
import { fetchParticipants, createParticipant, updateParticipant, deleteParticipant, fetchUpcomingEventsForParticipant } from './api';

function Participants() {
  const [participants, setParticipants] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [participantEvents, setParticipantEvents] = useState([]);

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

  const handleFormSubmit = async (data) => {
    try {
      if (selectedParticipant) {
        await updateParticipant(selectedParticipant.id, data);
      } else {
        await createParticipant(data);
      }

      const updatedParticipants = await fetchParticipants();
      setParticipants(updatedParticipants);
      setModalOpen(false);
      setSelectedParticipant(null);
    } catch (error) {
      console.error('Failed to save participant:', error);
    }
  };

  const handleEdit = (participant) => {
    setSelectedParticipant(participant);
    setModalOpen(true);
  };

  const handleDelete = (participant) => {
    setSelectedParticipant(participant);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteParticipant(selectedParticipant.id);
      setParticipants(participants.filter(p => p.id !== selectedParticipant.id));
      setConfirmModalOpen(false);
      setSelectedParticipant(null);
    } catch (error) {
      console.error('Failed to delete participant:', error);
    }
  };

  const handleShowDetails = async (participant) => {
    setSelectedParticipant(participant);
    try {
      const events = await fetchUpcomingEventsForParticipant(participant.id);
      setParticipantEvents(events);
    } catch (error) {
      console.error('Failed to fetch participant events:', error);
    }
    setDetailsModalOpen(true);
  };

  const formFields = [
    { label: 'First Name', name: 'first_name', defaultValue: selectedParticipant?.first_name || '' },
    { label: 'Last Name', name: 'last_name', defaultValue: selectedParticipant?.last_name || '' },
    { label: 'Email', name: 'email', type: 'email', defaultValue: selectedParticipant?.email || '' },
    { label: 'Is Vegetarian', name: 'is_vegetarian', type: 'checkbox', defaultValue: selectedParticipant?.is_vegetarian || false },
  ];

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedParticipant(null);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedParticipant(null);
    setParticipantEvents([]);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 3 }}>Participants List</Typography>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 2 }}>
        Add New Participant
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Is Vegetarian</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant.id}>
                <TableCell>{participant.id}</TableCell>
                <TableCell>{participant.first_name}</TableCell>
                <TableCell>{participant.last_name}</TableCell>
                <TableCell>{participant.email}</TableCell>
                <TableCell>{participant.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleShowDetails(participant)} color="default">
                    <InfoIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(participant)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(participant)} color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalWithForm
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        fields={formFields}
        selectedRecord={selectedParticipant}
      />

      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Participant"
        description={`Are you sure you want to delete the participant "${selectedParticipant?.first_name} ${selectedParticipant?.last_name}"?`}
      />

      <Modal open={isDetailsModalOpen} onClose={handleDetailsModalClose}>
        <Box sx={{ p: 4, bgcolor: 'white', width: '400px', margin: 'auto', mt: '10%' }}>
          <Typography variant="h6">Participant Details</Typography>
          <Typography><strong>First Name:</strong> {selectedParticipant?.first_name}</Typography>
          <Typography><strong>Last Name:</strong> {selectedParticipant?.last_name}</Typography>
          <Typography><strong>Email:</strong> {selectedParticipant?.email}</Typography>
          <Typography><strong>Is Vegetarian:</strong> {selectedParticipant?.is_vegetarian ? 'Yes' : 'No'}</Typography>

          <Typography variant="h6" sx={{ mt: 2 }}>Upcoming Events</Typography>
          {participantEvents.length > 0 ? (
            <ul>
              {participantEvents.map(event => (
                <li key={event.id}>{event.name} on {new Date(event.date).toLocaleDateString()}</li>
              ))}
            </ul>
          ) : (
            <Typography>No upcoming events</Typography>
          )}
          <Button onClick={handleDetailsModalClose} sx={{ mt: 2 }} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default Participants;
