import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

function ConfirmationModal({ open, onClose, onConfirm, title, description }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          p: 4,
          boxShadow: 24,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>{description}</Typography>
        <Button variant="contained" color="primary" onClick={onConfirm} sx={{ mr: 2 }}>
          Confirm
        </Button>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
      </Box>
    </Modal>
  );
}

export default ConfirmationModal;
