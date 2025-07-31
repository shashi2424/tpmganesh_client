
import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, CardMedia, Box } from '@mui/material';

const EventWinners = ({ events, onImageClick }) => (
  <Card sx={{ mb: 3, background: '#e3f2fd' }}>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Event Winners</Typography>
      {events.map((event, idx) => (
        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {event.image && (
            <CardMedia
              component="img"
              image={event.image}
              alt={event.event}
              onClick={() => onImageClick && onImageClick(event)}
              sx={{
                width: 120,
                objectFit: 'cover',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                mr: 2,
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
          )}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{event.event}</Typography>
            <Typography variant="body2">PrizeRanker: {event.winner}</Typography>
            {event.description && (
              <Typography variant="body2">{event.description}</Typography>
            )}
          </Box>
        </Box>
      ))}
    </CardContent>
  </Card>
);

export default EventWinners; 