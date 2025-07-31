import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const MenuBar = ({ onNavigate }) => {
  // Removed year dropdown logic

  return (
    <AppBar position="static" sx={{ background: 'linear-gradient(90deg, #ff9800 80%, #fff3e0 100%)' }}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{ flexGrow: 1, fontFamily: 'Baloo Bhaina 2, Tiro Devanagari, sans-serif', fontWeight: 700, color:"white" }}
        >
          Ganesh Chaturthi
        </Typography>
        <Button color="inherit" onClick={() => onNavigate('/')}>Home</Button>
        <Button color="inherit" onClick={() => onNavigate('/archive')}>Year-wise Archive</Button>
        <Button color="inherit" onClick={() => onNavigate('/admin')}>Admin</Button>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar; 