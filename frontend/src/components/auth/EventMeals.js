import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Modal, Box, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ModalWithForm from './ModalWithForm';
import ConfirmationModal from './ConfirmationModal';
import { fetchMealsForEvent, addMealToEvent, updateMealOnEvent, deleteMealFromEvent } from './api';

function EventMeals() {
  const { eventId } = useParams();
  const [meals, setMeals] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isDetailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const getMeals = async () => {
      try {
        const data = await fetchMealsForEvent(eventId);
        setMeals(data);
      } catch (error) {
        console.error('Failed to fetch meals:', error);
      }
    };

    getMeals();
  }, [eventId]);

  const handleFormSubmit = async (data) => {
    try {
      if (selectedMeal) {
        await updateMealOnEvent(eventId, selectedMeal.id, data);
      } else {
        await addMealToEvent(eventId, data);
      }

      const meals = await fetchMealsForEvent(eventId);
      setMeals(meals);
      setModalOpen(false);
      setSelectedMeal(null);
    } catch (error) {
      console.error('Failed to save meal:', error);
    }
  };

  const handleEdit = (meal) => {
    setSelectedMeal(meal);
    setModalOpen(true);
  };

  const handleDelete = (meal) => {
    setSelectedMeal(meal);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteMealFromEvent(eventId, selectedMeal.id);
      setMeals(meals.filter(m => m.id !== selectedMeal.id));
      setConfirmModalOpen(false);
      setSelectedMeal(null);
    } catch (error) {
      console.error('Failed to delete meal:', error);
    }
  };

  const handleShowDetails = (meal) => {
    setSelectedMeal(meal);
    setDetailsModalOpen(true);
  };

  const formFields = [
    { label: 'Meal Name', name: 'name', defaultValue: selectedMeal?.name || '' },
    {
      label: 'Meal Type',
      name: 'meal_type',
      type: 'select',
      defaultValue: selectedMeal?.meal_type || '',
      options: [
        { label: 'Dinner', value: 'Dinner' },
        { label: 'Lunch', value: 'Lunch' },
        { label: 'Breakfast', value: 'Breakfast' }
      ]
    },
    { label: 'Is Vegetarian', name: 'is_vegetarian', type: 'checkbox', defaultValue: selectedMeal?.is_vegetarian || false },
  ];

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMeal(null);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
    setSelectedMeal(null);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" sx={{ my: 3 }}>Event Meals</Typography>
      <Button variant="contained" color="primary" onClick={() => setModalOpen(true)} sx={{ mb: 2 }}>
        Add New Meal
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Is Vegetarian</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {meals.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell>{meal.id}</TableCell>
                <TableCell>{meal.name}</TableCell>
                <TableCell>{meal.meal_type}</TableCell>
                <TableCell>{meal.is_vegetarian ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleShowDetails(meal)} color="default">
                    <InfoIcon />
                  </IconButton>
                  <IconButton onClick={() => handleEdit(meal)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(meal)} color="secondary">
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
        selectedRecord={selectedMeal}
      />

      <ConfirmationModal
        open={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Meal"
        description={`Are you sure you want to delete the meal "${selectedMeal?.name}"?`}
      />

      <Modal open={isDetailsModalOpen} onClose={handleDetailsModalClose}>
        <Box sx={{ p: 4, bgcolor: 'white', width: '400px', margin: 'auto', mt: '10%' }}>
          <Typography variant="h6">Meal Details</Typography>
          <Typography><strong>Name:</strong> {selectedMeal?.name}</Typography>
          <Typography><strong>Type:</strong> {selectedMeal?.meal_type}</Typography>
          <Typography><strong>Is Vegetarian:</strong> {selectedMeal?.is_vegetarian ? 'Yes' : 'No'}</Typography>
          <Button onClick={handleDetailsModalClose} sx={{ mt: 2 }} variant="contained" color="primary">
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default EventMeals;
