import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../auth';
import { login } from './api';
import Modal from './Modal';
import { TextField, Button, Container, Typography, Box, Link, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Lock from '@mui/icons-material/Lock';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', description: '', status: 'error' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      dispatch(setAuthData({
        userId: data.user_id,
        token: data.access_token,
        tokenLife: data.token_life,
      }));

      navigate('/dashboard');
      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login error:', error);
      setModalContent({
        title: 'Login Failed',
        description: error.message || 'An error occurred during login. Please try again.',
        status: 'error',
      });
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={handleLogin} 
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
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
          label="Password"
          variant="outlined"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
          variant="contained" 
          color="primary" 
          type="submit" 
          fullWidth
          sx={{ mt: 3 }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            Register here
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

export default Login;
