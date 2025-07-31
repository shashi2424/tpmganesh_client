import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardActionArea, CardContent, Typography, Grid, Box } from '@mui/material';

const API_URL = process.env.REACT_APP_API_URL;

const blankYearData = {
  gallery: [],
  ladduWinner: { name: '', image: '', description: '' },
  eventWinners: [],
  idolContributor: '',
  otherContributors: [],
  collection: 0,
  expenses: [],
};

const YearArchiveList = () => {
  const [years, setYears] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/festival`)
      .then(res => res.json())
      .then(data => setYears(data));
  }, []);

  const handleYearClick = (year) => {
    setTimeout(() => navigate(`/archive/${year}`), 200);
  };

  return (
    <Box sx={{ py: 6, minHeight: '100vh', background: 'linear-gradient(135deg, #fafafa 0%, #e3f2fd 60%, #bbdefb 100%)' }}>
      <Typography variant="h3" align="center" sx={{ mb: 6, color: '#333', fontWeight: 900, letterSpacing: 2, fontFamily: 'Baloo Bhaina 2, Tiro Devanagari, sans-serif' }}>
        Year-wise Archive
      </Typography>
      <Grid container spacing={{ xs: 3, sm: 4, md: 5 }} justifyContent="center" alignItems="stretch">
        {years.map((y) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={y.year} display="flex">
            <Card
              tabIndex={0}
              onClick={() => handleYearClick(y.year)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleYearClick(y.year)}
              elevation={6}
              sx={{
                flex: 1,
                minHeight: 180,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(6px)',
                borderRadius: 5,
                boxShadow: '0 4px 24px rgba(33, 150, 243, 0.1)',
                cursor: 'pointer',
                transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s',
                '&:hover': {
                  transform: 'scale(1.06) rotate(-2deg)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.2), 0 0 0 4px rgba(25, 118, 210, 0.1)',
                  background: 'rgba(255,255,255,0.95)',
                },
                '&:active': {
                  transform: 'scale(0.97) rotate(1deg)',
                  boxShadow: '0 2px 8px rgba(33, 150, 243, 0.1)',
                },
              }}
            >
              <CardActionArea sx={{ height: '100%' }}>
                <CardContent sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{
                    width: 64,
                    height: 64,
                    mb: 2,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                    boxShadow: '0 2px 12px rgba(33, 150, 243, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900 }}>{y.year.toString().slice(-2)}</Typography>
                  </Box>
                  <Typography variant="h6" sx={{ color: '#333', fontWeight: 700, letterSpacing: 1, fontFamily: 'Baloo Bhaina 2, Tiro Devanagari, sans-serif' }}>
                    Ganesh Chaturthi {y.year}
                  </Typography>
                  {typeof y.remaining_amount === 'number' && (
                    <Typography variant="body2" sx={{ color: '#1976d2', mt: 1, fontWeight: 600 }}>
                      Remaining Amount: ₹{y.remaining_amount}
                    </Typography>
                  )}
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default YearArchiveList; 