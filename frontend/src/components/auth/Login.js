import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../../auth';
import { login } from './api';
import LogoutButton from './LogoutButton';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    }
  };

  return (
    <Container maxWidth="sm">
      <Box 
        component="form" 
        onSubmit={handleLogin} 
        sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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
        <LogoutButton></LogoutButton>
      </Box>
    </Container>
  );
}

export default Login;
