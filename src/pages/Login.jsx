import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { ArrowBack, Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'ganesha2024') {
      onLogin();
    } else {
      setError('Incorrect username or password');
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <Box sx={{ 
      py: 4, 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fafafa 0%, #e3f2fd 60%, #bbdefb 100%)',
      position: 'relative'
    }}>
      {/* Back Button */}
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
            transform: 'scale(1.1)',
          },
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <ArrowBack />
      </IconButton>

      <Paper 
        elevation={6} 
        sx={{ 
          p: 4, 
          mb: 4, 
          background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(10px)',
          maxWidth: 400, 
          mx: 'auto',
          mt: 8,
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#333', 
            mb: 3, 
            textAlign: 'center',
            fontWeight: 700,
            fontFamily: 'Baloo Bhaina 2, Tiro Devanagari, sans-serif'
          }}
        >
          Admin Login
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976d2',
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1565c0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1976d2',
                '&.Mui-focused': {
                  color: '#1565c0',
                },
              },
            }}
          />
          
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#1976d2',
                },
                '&:hover fieldset': {
                  borderColor: '#1565c0',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1565c0',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#1976d2',
                '&.Mui-focused': {
                  color: '#1565c0',
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
          
          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2, 
                textAlign: 'center',
                fontWeight: 600
              }}
            >
              {error}
            </Typography>
          )}
          
          <Button 
            type="submit" 
            variant="contained" 
            fullWidth
            sx={{
              py: 1.5,
              background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;