import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Slider from 'react-slick';
import "slick-carousel/slick-carousel.css";
import "slick-carousel/slick-theme.css";
import { useParams } from 'react-router-dom';
import FestivalGallery from '../components/FestivalGallery';
import LadduWinner from '../components/LadduWinner';
import EventWinners from '../components/EventWinners';
import Contributors from '../components/Contributors';
import CollectionExpenses from '../components/CollectionExpenses';
import { 
  Container, 
  Typography, 
  Paper, 
  Box
} from '@mui/material';

// Custom styles for react-slick
const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  swipe: true,
  arrows: false,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        dots: false,
        arrows: false
      }
    }
  ]
};

const YearArchive = ({ year: propYear }) => {
  const params = useParams();
  const year = propYear || params.year;
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [allMediaItems, setAllMediaItems] = useState([]);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/festival/${year}`)
      .then(res => res.json())
      .then(resData => {
        setData(resData.data || {});
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year]);

  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  const ladduWinner = data.ladduWinner || { name: '', image: '', description: '' };
  const eventWinners = Array.isArray(data.eventWinners) ? data.eventWinners : [];
  const idolContributor = typeof data.idolContributor === 'object' && data.idolContributor !== null ? data.idolContributor : { name: '', image: '' };
  const otherContributors = Array.isArray(data.otherContributors) ? data.otherContributors : [];
  const collection = typeof data.collection === 'number' ? data.collection : 0;
  const expenses = Array.isArray(data.expenses) ? data.expenses : [];

  // Calculate totals for summary card
  const totalContribution = otherContributors.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, ex) => sum + (Number(ex.amount) || 0), 0);
  const remainingAmount = totalContribution - totalExpenses;

  // Collect all media items from various components - runs once when component mounts or data changes
  useEffect(() => {
    const allMedia = [];
    if (gallery && gallery.length > 0) {
      gallery.forEach((item, index) => {
        const mediaUrl = item.url || item.src;
        if (mediaUrl) {
          allMedia.push({
            src: mediaUrl,
            url: mediaUrl,
            alt: item.alt || `Gallery image ${index + 1}`,
            type: item.type || (mediaUrl.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'),
            source: 'gallery',
            index: index
          });
        }
      });
    }
    if (ladduWinner.image) {
      allMedia.push({
        src: ladduWinner.image,
        url: ladduWinner.image,
        alt: `Laddu Winner - ${ladduWinner.name}`,
        type: ladduWinner.image.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image',
        source: 'ladduWinner',
        index: 0
      });
    }
    if (eventWinners && eventWinners.length > 0) {
      eventWinners.forEach((event, index) => {
        if (event.image) {
          allMedia.push({
            src: event.image,
            url: event.image,
            alt: `${event.event} Winner - ${event.winner}`,
            type: event.image.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image',
            source: 'eventWinner',
            index: index
          });
        }
      });
    }
    setAllMediaItems(allMedia);
  }, [year, gallery, ladduWinner, eventWinners]);

  // Handlers for media viewer
  const openMediaViewer = (clickedMedia) => {
    const index = allMediaItems.findIndex(item => {
      const clickedSrc = clickedMedia.src || clickedMedia.url || clickedMedia;
      const itemSrc = item.src || item.url;
      return itemSrc === clickedSrc;
    });
    setInitialMediaIndex(index >= 0 ? index : 0);
    setMediaViewerOpen(true);
  };
  const closeMediaViewer = () => setMediaViewerOpen(false);
  const handleGalleryImageClick = (item, idx) => {
    setInitialMediaIndex(idx);
    setMediaViewerOpen(true);
  };
  const handleLadduWinnerClick = () => {
    if (ladduWinner.image) {
      openMediaViewer({ 
        src: ladduWinner.image, 
        url: ladduWinner.image,
        alt: `Laddu Winner - ${ladduWinner.name}`,
        type: ladduWinner.image.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
      });
    }
  };
  const handleEventWinnerClick = (event) => {
    if (event.image) {
      openMediaViewer({ 
        src: event.image, 
        url: event.image,
        alt: `${event.event} Winner - ${event.winner}`,
        type: event.image.match(/\.(mp4|webm|ogg)$/i) ? 'video' : 'image'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4, backgroundColor: '#fafafa' }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4, background: '#e3f2fd' }}>
        <Typography variant="h4" sx={{ color: '#333', mb: 2 }}>
          Ganesh Chaturthi {year}
        </Typography>
      </Paper>


      <Contributors 
        idolContributorName={idolContributor.name}
        idolContributorImage={idolContributor.image}
        otherContributors={otherContributors} 
      />


      <LadduWinner 
        winner={ladduWinner} 
        onImageClick={handleLadduWinnerClick}
      />
      <EventWinners 
        events={eventWinners} 
        onImageClick={handleEventWinnerClick}
      />
      <FestivalGallery 
        gallery={gallery} 
        onImageClick={handleGalleryImageClick}
      />


      <CollectionExpenses collection={collection} expenses={expenses} />
 

      {/* Summary Card for Collections & Expenses */}
      <Box sx={{
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
      </Box>
      {/* MediaViewer Modal for Gallery, LadduWinner, EventWinners */}
      <Dialog
        open={mediaViewerOpen}
        onClose={closeMediaViewer}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: { background: 'rgba(0,0,0,0.95)', boxShadow: 'none' }
        }}
      >
        <DialogContent sx={{ position: 'relative', p: 0, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.95)' }}>
          <IconButton
            aria-label="close"
            onClick={closeMediaViewer}
            sx={{ position: 'absolute', top: 8, right: 8, color: '#fff', zIndex: 2 }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          {allMediaItems.length > 1 && (
            <IconButton
              aria-label="previous"
              onClick={() => setInitialMediaIndex((initialMediaIndex - 1 + allMediaItems.length) % allMediaItems.length)}
              sx={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2 }}
            >
              <NavigateBeforeIcon fontSize="large" />
            </IconButton>
          )}
          {allMediaItems.length > 1 && (
            <IconButton
              aria-label="next"
              onClick={() => setInitialMediaIndex((initialMediaIndex + 1) % allMediaItems.length)}
              sx={{ position: 'absolute', right: 48, top: '50%', transform: 'translateY(-50%)', color: '#fff', zIndex: 2 }}
            >
              <NavigateNextIcon fontSize="large" />
            </IconButton>
          )}
          <Slider
            {...sliderSettings}
            initialSlide={initialMediaIndex}
            afterChange={setInitialMediaIndex}
            style={{ width: '100%', minHeight: 400 }}
          >
            {allMediaItems.map((media, idx) => (
              <Box key={idx} sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={media.alt || ''}
                    style={{ 
                      maxWidth: '90vw', 
                      maxHeight: '80vh', 
                      borderRadius: 8, 
                      boxShadow: '0 4px 32px rgba(0,0,0,0.5)',
                      margin: '0 auto'  // Center the image
                    }}
                  />
                ) : (
                  <video
                    src={media.url}
                    controls
                    style={{ 
                      maxWidth: '90vw', 
                      maxHeight: '80vh', 
                      borderRadius: 8, 
                      background: '#000',
                      margin: '0 auto'  // Center the video
                    }}
                  />
                )}
              </Box>
            ))}
          </Slider>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default YearArchive;