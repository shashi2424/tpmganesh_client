import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, IconButton, Dialog, DialogContent, useTheme, useMediaQuery } from '@mui/material';
import { Close, NavigateBefore, NavigateNext } from '@mui/icons-material';
import SwipeableViews from 'react-swipeable-views';

const FestivalGallery = ({ gallery, onImageClick }) => {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  // For swipeable views, track if animating for pointer events
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    // Reset active step when dialog closes
    if (!open) {
      setActiveStep(0);
    }
  }, [open]);

  const handleOpen = (index) => {
    setActiveStep(index);
    setOpen(true);
  };
  const handleViewAllOpen = () => {
    setViewAllOpen(true);
  };
  const handleViewAllClose = () => {
    setViewAllOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setActiveStep((prev) => (prev + 1) % gallery.length);
  };

  const handleBack = (e) => {
    if (e) e.stopPropagation();
    setActiveStep((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  // If gallery is not an array or is empty, show a message
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>Festival Gallery</Typography>
        <Typography variant="body1" sx={{ color: '#666' }}>No images available for this year.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#333' }}>
        Festival Gallery
      </Typography>
      <Grid container spacing={2}>
        {(gallery.length > 6 ? gallery.slice(0, 6) : gallery).map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => {
                if (gallery.length > 6 && idx === 5) {
                  handleViewAllOpen();
                } else {
                  handleOpen(idx);
                }
              }}
            >
              {item.type === 'image' ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={item.url}
                  alt={`Festival ${idx}`}
                  sx={{ objectFit: 'cover' }}
                />
              ) : (
                <CardMedia
                  component="video"
                  height="180"
                  src={item.url}
                  controls={false}
                  sx={{ objectFit: 'cover' }}
                  onLoadedData={(e) => {
                    e.target.currentTime = 1;
                  }}
                />
              )}
              {/* Overlay for 6+ */}
              {gallery.length > 6 && idx === 5 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0,0,0,0.55)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    fontWeight: 900,
                    letterSpacing: 2,
                    borderRadius: 2,
                    zIndex: 2
                  }}
                >
                  +{gallery.length - 6}
                </Box>
              )}
            </Card>
          </Grid>
        ))}
      {/* View All Modal for all images/videos */}
      <Dialog
        open={viewAllOpen}
        onClose={handleViewAllClose}
        maxWidth={fullScreen ? false : 'md'}
        fullScreen={fullScreen}
        fullWidth
        PaperProps={{
          style: { background: 'rgba(0,0,0,0.97)', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 2, minHeight: fullScreen ? '100vh' : 500, background: 'rgba(0,0,0,0.97)' }}>
          <IconButton
            aria-label="close"
            onClick={handleViewAllClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
          >
            <Close fontSize="large" />
          </IconButton>
          <Typography variant="h6" sx={{ color: '#fff', mb: 3, textAlign: 'center', fontWeight: 700 }}>
            All Festival Gallery
          </Typography>
          <Grid container spacing={2}>
            {gallery.map((item, idx) => (
              <Grid item xs={6} sm={4} md={3} key={idx}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    borderRadius: 2,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: '0 4px 20px rgba(255,152,0,0.2)',
                      transform: 'scale(1.03)'
                    }
                  }}
                  onClick={() => {
                    handleViewAllClose();
                    handleOpen(idx);
                  }}
                >
                  {item.type === 'image' ? (
                    <CardMedia
                      component="img"
                      height="120"
                      image={item.url}
                      alt={`Gallery ${idx}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <CardMedia
                      component="video"
                      height="120"
                      src={item.url}
                      controls={false}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
      </Grid>

      {/* Modal for fullscreen gallery with swipeable views */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={fullScreen ? false : 'md'}
        fullScreen={fullScreen}
        fullWidth
        PaperProps={{
          style: { background: 'rgba(0,0,0,0.95)', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, minHeight: fullScreen ? '100vh' : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.95)' }}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
          >
            <Close fontSize="large" />
          </IconButton>
          {gallery.length > 1 && (
            <IconButton
              aria-label="previous"
              onClick={() => setActiveStep((activeStep - 1 + gallery.length) % gallery.length)}
              sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2 }}
            >
              <NavigateBefore fontSize="large" />
            </IconButton>
          )}
          {gallery.length > 1 && (
            <IconButton
              aria-label="next"
              onClick={() => setActiveStep((activeStep + 1) % gallery.length)}
              sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2 }}
            >
              <NavigateNext fontSize="large" />
            </IconButton>
          )}
          <SwipeableViews
            index={activeStep}
            onChangeIndex={setActiveStep}
            enableMouseEvents
            animateTransitions
            resistance
            axis={fullScreen ? 'x' : 'x'}
            onSwitching={(index, type) => setIsAnimating(type === 'move')}
            style={{ width: '100%', minHeight: fullScreen ? '100vh' : 400 }}
          >
            {gallery.map((media, idx) => (
              <Box key={idx} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: fullScreen ? '100vh' : 400 }}>
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.alt || ''}
                    style={{
                      maxWidth: fullScreen ? '98vw' : '90vw',
                      maxHeight: fullScreen ? '90vh' : '80vh',
                      borderRadius: 8,
                      boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                      pointerEvents: isAnimating ? 'none' : 'auto',
                      userSelect: 'none',
                      touchAction: 'pan-y'
                    }}
                    draggable={false}
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    style={{
                      maxWidth: fullScreen ? '98vw' : '90vw',
                      maxHeight: fullScreen ? '90vh' : '80vh',
                      borderRadius: 8,
                      background: '#000',
                      pointerEvents: isAnimating ? 'none' : 'auto',
                      userSelect: 'none',
                      touchAction: 'pan-y'
                    }}
                    draggable={false}
                  />
                )}
              </Box>
            ))}
          </SwipeableViews>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default FestivalGallery; 