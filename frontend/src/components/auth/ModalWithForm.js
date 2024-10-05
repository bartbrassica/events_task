import React, { useEffect, useState } from 'react';
import { Modal, Box, Button, TextField, FormControlLabel, Checkbox, Select, MenuItem } from '@mui/material';

function ModalWithForm({ open, onClose, onSubmit, fields }) {
  const [formValues, setFormValues] = useState({});

  useEffect(() => {
    const initialValues = fields.reduce((acc, field) => {
      acc[field.name] = field.type === 'checkbox' ? !!field.defaultValue : field.defaultValue || '';
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

  const handleSelectChange = (name, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
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
                      checked={!!formValues[field.name]}
                      onChange={handleChange}
                      name={field.name}
                    />
                  }
                  label={field.label}
                />
              ) : field.type === 'select' ? (
                <div>
                  <label>{field.label}</label>
                  <Select
                    fullWidth
                    value={formValues[field.name]}
                    onChange={(e) => handleSelectChange(field.name, e.target.value)}
                    name={field.name}
                  >
                    {field.options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
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
