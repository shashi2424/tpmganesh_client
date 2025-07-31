import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

const LadduWinner = ({ winner, onImageClick }) => (

<Card sx={{ display: 'flex', mb: 3, background: '#e3f2fd' }}>
      {winner.image && (
        <CardMedia
          component="img"
          sx={{ 
            width: 120, 
            objectFit: 'cover',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
          image={winner.image}
          alt={winner.name}
          onClick={onImageClick}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <CardContent>
          <Typography variant="h6" sx={{ color: '#1976d2' }}>
            Laddu Winner
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {winner.name}
          </Typography>
          <Typography variant="body2">
            {winner.description}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  
);

export default LadduWinner; 