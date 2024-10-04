import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';

function ModalWithForm({ open, onClose, onSubmit, fields }) {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {});
    setFormValues(initialValues);
  }, [fields]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bgcolor: 'white', width: '400px', margin: 'auto', mt: '10%' }}>
        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name} style={{ marginBottom: '16px' }}>
              {field.type === 'checkbox' ? (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues[field.name] || false}
                      onChange={handleChange}
                      name={field.name}
                    />
                  }
                  label={field.label}
                />
              ) : (
                <TextField
                  label={field.label}
                  name={field.name}
                  type={field.type || 'text'}
                  value={formValues[field.name] || ''}
                  onChange={handleChange}
                  fullWidth
                />
              )}
            </div>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default ModalWithForm;
