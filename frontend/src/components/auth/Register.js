import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from './api';
import Modal from './Modal';

import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Link,
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Email from '@mui/icons-material/Email';
import Person from '@mui/icons-material/Person';
import Lock from '@mui/icons-material/Lock';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', status: 'error' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await register(formData);

      setModalContent({
        title: 'Registration Successful',
        description: 'You have successfully registered! Redirecting to login...',
        status: 'success',
      });

      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        navigate('/login');
      }, 2000);
    } catch (error) {
      setModalContent({
        title: 'Registration Failed',
        description: 'An error occurred during registration. Please try again.',
        status: 'error',
      });
      setModalOpen(true);
      console.error('Error during registration:', error);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: '24px' }} gutterBottom>
        Register
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        <TextField
          variant="outlined"
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Person />
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          required
          margin="normal"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Lock />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 3, mb: 2 }}
        >
          Register
        </Button>
        <Typography variant="body2">
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            Back to login.
          </Link>
        </Typography>
      </Box>

      <Modal
        open={modalOpen}
        status={modalContent.status}
        title={modalContent.title}
        description={modalContent.description}
        onClose={handleCloseModal}
      />
    </Container>
  );
}

export default Register;
