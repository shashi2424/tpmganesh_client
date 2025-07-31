
import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Box } from '@mui/material';

const Contributors = ({ idolContributorName, idolContributorImage, otherContributors }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Contributors</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        {idolContributorImage && (
          <Box
            sx={{
              width: 100,
              height: 100,
              mr: 3,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 2,
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 3
            }}
          >
            <img
              src={idolContributorImage}
              alt={idolContributorName}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', borderRadius: '12px' }}
            />
          </Box>
        )}
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Idol Contributor: {idolContributorName || 'N/A'}
        </Typography>
      </Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>Other Contributors:</Typography>
      <TableContainer component={Paper} sx={{ boxShadow: 'none', background: 'transparent' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1976d2' }}>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(otherContributors) && otherContributors.length > 0 ? (
              otherContributors.map((c, idx) => (
                <TableRow key={idx}>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No contributors</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContent>
  </Card>
);

export default Contributors; 