import React from 'react';
import { useDispatch } from 'react-redux';
import { logout } from './api';
import { Button } from '@mui/material';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await logout(dispatch);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Button 
        variant="contained" 
        color="error" 
        type="submit" 
        fullWidth
        onClick={handleLogout}
        sx={{ mt: 3 }}
    >
        Logout
    </Button>
  );
}

export default LogoutButton;