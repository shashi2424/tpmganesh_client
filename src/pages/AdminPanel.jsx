import React, { useState, useEffect } from 'react';
import {
  Typography, Paper, Box, Button, MenuItem, Select, InputLabel, FormControl, Grid, Card, CardMedia, CircularProgress, Snackbar, Alert, TextField, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const API_URL = process.env.REACT_APP_API_URL

const defaultYearData = {
  gallery: [],
  ladduWinner: { name: '', image: '', description: '' },
  eventWinners: [],
  idolContributor: { name: '', image: '' },
  otherContributors: [],
  expenses: [],
};

const AdminPanel = () => {
  const [years, setYears] = useState([]); // [{year, data}]
  const [selectedYear, setSelectedYear] = useState('');
  const [yearData, setYearData] = useState(defaultYearData);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [ladduImageFile, setLadduImageFile] = useState(null);
  const [ladduUploading, setLadduUploading] = useState(false);
  const [idolImageFile, setIdolImageFile] = useState(null);
  const [idolUploading, setIdolUploading] = useState(false);
  const [eventWinnerFiles, setEventWinnerFiles] = useState({});
  const [eventWinnerUploading, setEventWinnerUploading] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editMode, setEditMode] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newYear, setNewYear] = useState('');

  // Fetch all years from backend
  useEffect(() => {
    fetch(`${API_URL}/festival`)
      .then(res => res.json())
      .then(data => {
        setYears(data);
        if (data.length > 0) {
          setSelectedYear(data[0].year);
          setYearData(data[0].data);
        }
      });
  }, []);

  // When selectedYear changes, update yearData
  useEffect(() => {
    if (!selectedYear) return;
    const y = years.find(y => y.year === Number(selectedYear));
    setYearData(y ? y.data : defaultYearData);
  }, [selectedYear, years]);

  // Add new year
  const handleAddYear = async () => {
    if (!newYear) return;
    try {
      const res = await fetch(`${API_URL}/festival`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: Number(newYear), data: defaultYearData })
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Year added!', severity: 'success' });
        setAddDialogOpen(false);
        setNewYear('');
        // Refresh years
        const updated = await fetch(`${API_URL}/festival`).then(r => r.json());
        setYears(updated);
        setSelectedYear(Number(newYear));
      } else {
        setSnackbar({ open: true, message: 'Failed to add year', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  // Delete year
  const handleDeleteYear = async (year) => {
    if (!window.confirm('Delete this year and all its data?')) return;
    try {
      const res = await fetch(`${API_URL}/festival/${year}/delete`, { method: 'POST' });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Year deleted!', severity: 'success' });
        // Refresh years
        const updated = await fetch(`${API_URL}/festival`).then(r => r.json());
        setYears(updated);
        setSelectedYear(updated.length > 0 ? updated[0].year : '');
      } else {
        setSnackbar({ open: true, message: 'Failed to delete year', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  // Save year data (edit or update)
  const handleSaveYear = async () => {
    try {
      const res = await fetch(`${API_URL}/festival/${selectedYear}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: yearData })
      });
      if (res.ok) {
        setSnackbar({ open: true, message: 'Year data saved!', severity: 'success' });
        // Refresh years
        const updated = await fetch(`${API_URL}/festival`).then(r => r.json());
        setYears(updated);
      } else {
        setSnackbar({ open: true, message: 'Failed to save', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
    setEditMode(false);
  };

  // Gallery multiple file upload
  const handleGalleryFilesChange = (e) => {
    setGalleryFiles(Array.from(e.target.files));
  };
  const handleGalleryUpload = async (e) => {
    e.preventDefault();
    if (!galleryFiles.length) return;
    setGalleryUploading(true);
    const formData = new FormData();
    galleryFiles.forEach(f => formData.append('file', f));
    try {
      console.log('Uploading files:', galleryFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header manually, let the browser set it with the boundary
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (data.urls) {
        // data.urls is an array of URLs
        const newGallery = data.urls.map(url => {
          const ext = url.split('.').pop().toLowerCase();
          const type = ['mp4', 'webm', 'ogg'].includes(ext) ? 'video' : 'image';
          return { type, url };
        });
        setYearData(prev => ({ ...prev, gallery: [...(prev.gallery || []), ...newGallery] }));
        setSnackbar({ open: true, message: 'Gallery upload successful!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Upload failed', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setGalleryUploading(false);
      setGalleryFiles([]);
    }
  };

  // Laddu Winner image upload
  const handleLadduImageChange = (e) => {
    setLadduImageFile(e.target.files[0]);
  };
  const handleLadduImageUpload = async () => {
    if (!ladduImageFile) return;
    setLadduUploading(true);
    const formData = new FormData();
    formData.append('file', ladduImageFile);
    try {
      console.log('Uploading file:', { name: ladduImageFile.name, size: ladduImageFile.size, type: ladduImageFile.type });
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        setYearData(prev => ({
          ...prev,
          ladduWinner: { ...prev.ladduWinner, image: Array.isArray(data.urls) ? data.urls[0] : data.urls }
        }));
        setSnackbar({ open: true, message: 'Laddu Winner image uploaded!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Upload failed', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLadduUploading(false);
      setLadduImageFile(null);
    }
  };

  // Delete Laddu Winner image
  const handleDeleteLadduImage = async () => {
    const imageUrl = yearData.ladduWinner?.image;
    if (!imageUrl) return;
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    try {
      const res = await fetch(`${API_URL}/upload/${filename}`, { method: 'DELETE' });
      if (res.ok) {
        setYearData(prev => ({
          ...prev,
          ladduWinner: { ...prev.ladduWinner, image: '' }
        }));
        setSnackbar({ open: true, message: 'Laddu Winner image deleted!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete image', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  // Idol Contributor image upload
  const handleIdolImageChange = (e) => {
    setIdolImageFile(e.target.files[0]);
  };
  const handleIdolImageUpload = async () => {
    if (!idolImageFile) return;
    setIdolUploading(true);
    const formData = new FormData();
    formData.append('file', idolImageFile);
    try {
      console.log('Uploading file:', { name: idolImageFile.name, size: idolImageFile.size, type: idolImageFile.type });
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        setYearData(prev => ({
          ...prev,
          idolContributor: { ...prev.idolContributor, image: Array.isArray(data.urls) ? data.urls[0] : data.urls }
        }));
        setSnackbar({ open: true, message: 'Idol Contributor image uploaded!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Upload failed', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIdolUploading(false);
      setIdolImageFile(null);
    }
  };

  // Delete Idol Contributor image
  const handleDeleteIdolImage = async () => {
    const imageUrl = yearData.idolContributor?.image;
    if (!imageUrl) return;
    // Extract filename from URL
    const filename = imageUrl.split('/').pop();
    try {
      const res = await fetch(`${API_URL}/upload/${filename}`, { method: 'DELETE' });
      if (res.ok) {
        setYearData(prev => ({
          ...prev,
          idolContributor: { ...prev.idolContributor, image: '' }
        }));
        setSnackbar({ open: true, message: 'Idol Contributor image deleted!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Failed to delete image', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  // Event Winner image upload
  const handleEventWinnerImageChange = (idx, file) => {
    setEventWinnerFiles(prev => ({ ...prev, [idx]: file }));
  };
  const handleEventWinnerImageUpload = async (idx) => {
    const file = eventWinnerFiles[idx];
    if (!file) return;
    setEventWinnerUploading(prev => ({ ...prev, [idx]: true }));
    const formData = new FormData();
    formData.append('file', file);
    try {
      console.log('Uploading file:', { name: file.name, size: file.size, type: file.type });
      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });
      const data = await res.json();
      if (res.ok && data.urls) {
        setYearData(prev => ({
          ...prev,
          eventWinners: prev.eventWinners.map((ew, i) => i === idx ? { ...ew, image: Array.isArray(data.urls) ? data.urls[0] : data.urls } : ew)
        }));
        setSnackbar({ open: true, message: 'Event Winner image uploaded!', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.error || 'Upload failed', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setEventWinnerUploading(prev => ({ ...prev, [idx]: false }));
      setEventWinnerFiles(prev => ({ ...prev, [idx]: null }));
    }
  };

  // Remove gallery item
  const handleRemoveGalleryItem = (idx) => {
    const fileUrl = yearData.gallery[idx]?.url;
    if (!fileUrl) return;
    // Extract filename from URL
    const filename = fileUrl.split('/').pop();
    fetch(`${API_URL}/upload/${filename}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setSnackbar({ open: true, message: 'Gallery item deleted!', severity: 'success' });
          setYearData((prev) => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== idx)
          }));
        } else {
          setSnackbar({ open: true, message: 'Failed to delete gallery item', severity: 'error' });
        }
      })
      .catch(err => {
        setSnackbar({ open: true, message: err.message, severity: 'error' });
      });
  };

  // Edit year data fields (generic handler)
  const handleFieldChange = (field, value) => {
    setYearData((prev) => ({ ...prev, [field]: value }));
  };

  // Edit laddu winner fields
  const handleLadduWinnerChange = (field, value) => {
    setYearData((prev) => ({
      ...prev,
      ladduWinner: { ...prev.ladduWinner, [field]: value }
    }));
  };

  // Edit event winners
  const handleEventWinnerChange = (idx, field, value) => {
    setYearData((prev) => ({
      ...prev,
      eventWinners: prev.eventWinners.map((ew, i) => i === idx ? { ...ew, [field]: value } : ew)
    }));
  };

  // Add event winner
  const handleAddEventWinner = () => {
    setYearData((prev) => ({
      ...prev,
      eventWinners: [...prev.eventWinners, { event: '', winner: '' }]
    }));
  };

  // Remove event winner
  const handleRemoveEventWinner = (idx) => {
    setYearData((prev) => ({
      ...prev,
      eventWinners: prev.eventWinners.filter((_, i) => i !== idx)
    }));
  };

  // Add expense
  const handleAddExpense = () => {
    setYearData((prev) => ({
      ...prev,
      expenses: [...prev.expenses, { category: '', amount: 0 }]
    }));
  };

  // Edit expense
  const handleExpenseChange = (idx, field, value) => {
    setYearData((prev) => ({
      ...prev,
      expenses: prev.expenses.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex)
    }));
  };

  // Remove expense
  const handleRemoveExpense = (idx) => {
    setYearData((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== idx)
    }));
  };

  // Add other contributor
  const handleAddContributor = () => {
    setYearData((prev) => ({
      ...prev,
      otherContributors: [...prev.otherContributors, { name: '', amount: 0 }]
    }));
  };

  // Edit other contributor
  const handleContributorChange = (idx, field, value) => {
    setYearData((prev) => ({
      ...prev,
      otherContributors: prev.otherContributors.map((c, i) => i === idx ? { ...c, [field]: value } : c)
    }));
  };

  // Remove contributor
  const handleRemoveContributor = (idx) => {
    setYearData((prev) => ({
      ...prev,
      otherContributors: prev.otherContributors.filter((_, i) => i !== idx)
    }));
  };

  // Calculate total contribution, expenses, and remaining amount
  const totalContribution = (yearData.otherContributors || []).reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalExpenses = (yearData.expenses || []).reduce((sum, ex) => sum + (Number(ex.amount) || 0), 0);
  const remainingAmount = totalContribution - totalExpenses;

  return (
    <Box sx={{ py: 4, background: 'var(--background-gradient)', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: '#e3f2fd', maxWidth: 900, mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#1976d2', mb: 2, fontWeight: 700 }}>
          Admin Panel
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mb: 2
          }}
        >
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
              labelId="year-label"
              value={selectedYear}
              label="Year"
              onChange={e => setSelectedYear(e.target.value)}
              sx={{ background: '#fff', borderRadius: 2 }}
            >
              {years.map((y) => (
                <MenuItem key={y.year} value={y.year}>{y.year}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" sx={{ml: 2, background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }} onClick={() => setAddDialogOpen(true)}>
            Add Year
          </Button>
          {selectedYear && (
            <Button variant="outlined" color="error" sx={{ ml: 2 }} onClick={() => handleDeleteYear(selectedYear)}>
              Delete Year
            </Button>
          )}
          <Button variant="contained" sx={{ ml: 2, background: editMode ? '#388e3c' : '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }} onClick={() => setEditMode(!editMode)}>
            {editMode ? 'Cancel Edit' : 'Edit Year Data'}
          </Button>
          {editMode && (
            <Button variant="contained" sx={{ ml: 2, background: '#388e3c', color: '#fff', fontWeight: 600, borderRadius: 2 }} onClick={handleSaveYear}>
              Save
            </Button>
          )}
        </Box>
        {selectedYear && (
          <Box sx={{ mt: 3 }}>
            {/* Gallery Upload & Preview */}
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 2, fontWeight: 600 }}>Gallery</Typography>
            <form onSubmit={handleGalleryUpload} style={{ marginBottom: 16 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<AddPhotoAlternateIcon />}
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={galleryUploading || !editMode}
                >
                  Choose Files
                  <input type="file" hidden multiple onChange={handleGalleryFilesChange} accept="image/*,video/*" />
                </Button>
                {galleryFiles.length > 0 && <Typography sx={{ color: '#1976d2' }}>{galleryFiles.map(f => f.name).join(', ')}</Typography>}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={galleryFiles.length === 0 || galleryUploading || !editMode}
                >
                  {galleryUploading ? <CircularProgress size={22} color="inherit" /> : 'Upload'}
                </Button>
              </Box>
            </form>
            <Grid container spacing={2}>
              {(yearData.gallery || []).map((item, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card sx={{ borderRadius: 2, boxShadow: 2, background: '#fafafa', position: 'relative' }}>
                    {item.type === 'image' ? (
                      <CardMedia
                        component="img"
                        height="160"
                        image={item.url}
                        alt={`Gallery ${idx}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <CardMedia
                        component="video"
                        height="160"
                        src={item.url}
                        controls
                        sx={{ objectFit: 'cover' }}
                      />
                    )}
                    {editMode && (
                      <IconButton size="small" sx={{ position: 'absolute', top: 8, right: 8, background: '#fff' }} onClick={() => handleRemoveGalleryItem(idx)}>
                        <DeleteIcon fontSize="small" color="error" />
                      </IconButton>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
            {/* Laddu Winner */}
            <Typography variant="h6" sx={{ color: '#1976d2', mt: 4, mb: 2, fontWeight: 600 }}>Laddu Winner</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <TextField
                label="Name"
                value={yearData.ladduWinner?.name || ''}
                onChange={e => handleLadduWinnerChange('name', e.target.value)}
                sx={{ background: '#fff', borderRadius: 2, mb: 1 }}
                disabled={!editMode}
              />
              <TextField
                label="Description"
                value={yearData.ladduWinner?.description || ''}
                onChange={e => handleLadduWinnerChange('description', e.target.value)}
                sx={{ background: '#fff', borderRadius: 2, mb: 1 }}
                disabled={!editMode}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  component="label"
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={ladduUploading || !editMode}
                >
                  Upload Image
                  <input type="file" hidden onChange={handleLadduImageChange} accept="image/*" />
                </Button>
                {ladduImageFile && <Typography sx={{ color: '#1976d2' }}>{ladduImageFile.name}</Typography>}
                <Button
                  onClick={handleLadduImageUpload}
                  variant="contained"
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={!ladduImageFile || ladduUploading || !editMode}
                >
                  {ladduUploading ? <CircularProgress size={22} color="inherit" /> : 'Save Image'}
                </Button>
              </Box>
              {yearData.ladduWinner?.image && (
                <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
                  <img src={yearData.ladduWinner.image} alt="Laddu Winner" style={{ maxWidth: 120, borderRadius: 8 }} />
                  {editMode && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { background: '#fff' }
                      }}
                      onClick={handleDeleteLadduImage}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
            {/* Event Winners */}
            <Typography variant="h6" sx={{ color: '#1976d2', mt: 4, mb: 2, fontWeight: 600 }}>Event Winners</Typography>
            {(yearData.eventWinners || []).map((ew, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <TextField
                  label="Event"
                  value={ew.event}
                  onChange={e => handleEventWinnerChange(idx, 'event', e.target.value)}
                  sx={{ background: '#fff', borderRadius: 2 }}
                  disabled={!editMode}
                />
                <TextField
                  label="Winner"
                  value={ew.winner}
                  onChange={e => handleEventWinnerChange(idx, 'winner', e.target.value)}
                  sx={{ background: '#fff', borderRadius: 2 }}
                  disabled={!editMode}
                />
                <TextField
                  label="Description"
                  value={ew.description || ''}
                  onChange={e => handleEventWinnerChange(idx, 'description', e.target.value)}
                  sx={{ background: '#fff', borderRadius: 2 }}
                  disabled={!editMode}
                />
                <Button
                  variant="contained"
                  component="label"
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={eventWinnerUploading[idx] || !editMode}
                >
                  Upload Image
                  <input type="file" hidden onChange={e => handleEventWinnerImageChange(idx, e.target.files[0])} accept="image/*" />
                </Button>
                {eventWinnerFiles[idx] && <Typography sx={{ color: '#1976d2' }}>{eventWinnerFiles[idx].name}</Typography>}
                <Button
                  onClick={() => handleEventWinnerImageUpload(idx)}
                  variant="contained"
                  sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                  disabled={!eventWinnerFiles[idx] || eventWinnerUploading[idx] || !editMode}
                >
                  {eventWinnerUploading[idx] ? <CircularProgress size={22} color="inherit" /> : 'Save Image'}
                </Button>
                {ew.image && (
                  <Box sx={{ mt: 1 }}>
                    <img src={ew.image} alt="Event Winner" style={{ maxWidth: 80, borderRadius: 8 }} />
                  </Box>
                )}
                {editMode && (
                  <IconButton onClick={() => handleRemoveEventWinner(idx)}><DeleteIcon color="error" /></IconButton>
                )}
              </Box>
            ))}
            {editMode && <Button onClick={handleAddEventWinner} sx={{ mt: 1, mb: 2 }}>Add Event Winner</Button>}
            {/* Idol Contributor */}
            <Typography variant="h6" sx={{ color: '#1976d2', mt: 4, mb: 2, fontWeight: 600 }}>Idol Contributor</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
              <TextField
                label="Name"
                value={yearData.idolContributor?.name || ''}
                onChange={e => setYearData(prev => ({ ...prev, idolContributor: { ...prev.idolContributor, name: e.target.value } }))}
                sx={{ background: '#fff', borderRadius: 2, mb: 1 }}
                disabled={!editMode}
              />
              <Button
                variant="contained"
                component="label"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                disabled={idolUploading || !editMode}
              >
                Upload Image
                <input type="file" hidden onChange={handleIdolImageChange} accept="image/*" />
              </Button>
              {idolImageFile && <Typography sx={{ color: '#1976d2' }}>{idolImageFile.name}</Typography>}
              <Button
                onClick={handleIdolImageUpload}
                variant="contained"
                sx={{ background: '#1976d2', color: '#fff', fontWeight: 600, borderRadius: 2 }}
                disabled={!idolImageFile || idolUploading || !editMode}
              >
                {idolUploading ? <CircularProgress size={22} color="inherit" /> : 'Save Image'}
              </Button>
              {yearData.idolContributor?.image && (
                <Box sx={{ mt: 1, position: 'relative', display: 'inline-block' }}>
                  <img src={yearData.idolContributor.image} alt="Idol Contributor" style={{ maxWidth: 80, borderRadius: 8 }} />
                  {editMode && (
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        background: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { background: '#fff' }
                      }}
                      onClick={handleDeleteIdolImage}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
            {/* Summary Card for Collections & Expenses */}
            {/* <Box sx={{
              mb: 4,
              p: 3,
              background: 'linear-gradient(90deg, #e3f2fd 60%, #f1f8e9 100%)',
              borderRadius: 3,
              boxShadow: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 4,
              justifyContent: 'space-between',
              border: '1px solid #bdbdbd'
            }}>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
                  Total Collections
                </Typography>
                <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 700 }}>
                  ₹{totalContribution}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#d32f2f', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
                  Total Expenses
                </Typography>
                <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 700 }}>
                  ₹{totalExpenses}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#388e3c', fontWeight: 700, letterSpacing: 1, mb: 0.5 }}>
                  Remaining Amount
                </Typography>
                <Typography variant="h5" sx={{ color: remainingAmount >= 0 ? '#388e3c' : '#d32f2f', fontWeight: 900 }}>
                  ₹{remainingAmount}
                </Typography>
              </Box>
            </Box> */}

            {/* Other Contributors */}
            <Typography variant="h6" sx={{ color: '#1976d2', mt: 4, mb: 2, fontWeight: 600 }}>Other Contributors</Typography>
            <Grid container spacing={2}>
              {(yearData.otherContributors || []).map((c, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', background: '#fff', borderRadius: 2, p: 2, mb: 1 }}>
                    <TextField
                      label="Name"
                      value={c.name}
                      onChange={e => handleContributorChange(idx, 'name', e.target.value)}
                      sx={{ background: '#fff', borderRadius: 2 }}
                      disabled={!editMode}
                    />
                    <TextField
                      label="Amount"
                      type="number"
                      value={c.amount}
                      onChange={e => handleContributorChange(idx, 'amount', e.target.value)}
                      sx={{ background: '#fff', borderRadius: 2 }}
                      disabled={!editMode}
                    />
                    {editMode && (
                      <IconButton onClick={() => handleRemoveContributor(idx)}><DeleteIcon color="error" /></IconButton>
                    )}
                  </Box>
                </Grid>
              ))}
            </Grid>
            {editMode && <Button onClick={handleAddContributor} sx={{ mt: 1, mb: 2 }}>Add Contributor</Button>}
            {/* Expenses */}
            <Typography variant="h6" sx={{ color: '#1976d2', mt: 4, mb: 2, fontWeight: 600 }}>Expenses</Typography>
            {(yearData.expenses || []).map((ex, idx) => (
              <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
                <TextField
                  label="Category"
                  value={ex.category}
                  onChange={e => handleExpenseChange(idx, 'category', e.target.value)}
                  sx={{ background: '#fff', borderRadius: 2 }}
                  disabled={!editMode}
                />
                <TextField
                  label="Amount"
                  type="number"
                  value={ex.amount}
                  onChange={e => handleExpenseChange(idx, 'amount', Number(e.target.value))}
                  sx={{ background: '#fff', borderRadius: 2 }}
                  disabled={!editMode}
                />
                {editMode && (
                  <IconButton onClick={() => handleRemoveExpense(idx)}><DeleteIcon color="error" /></IconButton>
                )}
              </Box>
            ))}
            {editMode && <Button onClick={handleAddExpense} sx={{ mt: 1, mb: 2 }}>Add Expense</Button>}
          </Box>
        )}
      </Paper>
      {/* Add Year Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Year</DialogTitle>
        <DialogContent>
          <TextField
            label="Year"
            type="number"
            value={newYear}
            onChange={e => setNewYear(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddYear} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;