import React from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const CollectionExpenses = ({ collection, expenses }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#e65100', mb: 1 }}>Expenses</Typography>
      {/* <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Total Collection: ₹{collection.toLocaleString()}</Typography>
      </Box> */}
      {/* <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>Expenses:</Typography> */}
      <List>
        {expenses.map((exp, idx) => (
          <ListItem key={idx} disablePadding>
            <ListItemText primary={`${exp.category}: ₹${exp.amount.toLocaleString()}`} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

export default CollectionExpenses; 