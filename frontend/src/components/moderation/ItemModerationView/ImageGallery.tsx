
import React, { useState } from 'react';
import {
  Box,
  Modal,
  IconButton,
  Stack,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Close,
  ZoomIn,
  ZoomOut,
  Fullscreen
} from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNext = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
    setZoom(1);
  };

  const handlePrev = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isModalOpen) {
      switch (event.key) {
        case 'ArrowLeft':
          handlePrev();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case 'Escape':
          setIsModalOpen(false);
          setZoom(1);
          break;
        case '+':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleResetZoom();
          break;
      }
    }
  };

  if (images.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 300, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100],
          borderRadius: 2,
          border: `1px dashed ${theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 300]}`
        }}
      >
        <Typography color="text.secondary">
          Изображения отсутствуют
        </Typography>
      </Box>
    );
  }

  return (
    <>

      <Box sx={{ mb: 2 }}>

        <Box
          sx={{
            width: '100%',
            height: isMobile ? 300 : 400,
            borderRadius: 3,
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative',
            backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100],
            border: `1px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 200]}`,
            mb: 2,
            '&:hover': {
              '& .overlay': {
                opacity: 1,
              }
            }
          }}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={images[selectedImage]}
            alt={`Главное изображение ${selectedImage + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
          />
          

          <Box
            className="overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'white', 
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                px: 2,
                py: 1,
                borderRadius: 2
              }}
            >
              Нажмите для просмотра
            </Typography>
          </Box>


          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '0.875rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            {selectedImage + 1} / {images.length}
          </Box>
        </Box>


        {images.length > 1 && (
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Все изображения ({images.length})
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              sx={{ 
                overflowX: 'auto',
                py: 1,
                px: 1,
                '&::-webkit-scrollbar': {
                  height: 6,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 800 : 100],
                  borderRadius: 3,
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 400],
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: theme.palette.grey[theme.palette.mode === 'dark' ? 500 : 600],
                  }
                }
              }}
            >
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 80,
                    height: 60,
                    flexShrink: 0,
                    cursor: 'pointer',
                    border: selectedImage === index ? 
                      `3px solid ${theme.palette.primary.main}` : 
                      `2px solid ${theme.palette.grey[theme.palette.mode === 'dark' ? 600 : 300]}`,
                    borderRadius: 1,
                    overflow: 'hidden',
                    transition: 'all 0.2s ease-in-out',
                    position: 'relative',
                    '&:hover': {
                      border: `2px solid ${theme.palette.primary.main}`,
                      transform: 'scale(1.05)',
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: selectedImage === index ? 
                        `rgba(25, 118, 210, 0.1)` : 'transparent',
                      transition: 'background-color 0.2s ease-in-out',
                    }
                  }}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Миниатюра ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                  

                  {selectedImage === index && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 8,
                        height: 8,
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: '50%',
                        border: `2px solid ${theme.palette.background.paper}`
                      }}
                    />
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>


      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setZoom(1);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(0, 0, 0, 0.95)'
        }}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <Box 
          sx={{ 
            position: 'relative', 
            maxWidth: '95vw', 
            maxHeight: '95vh',
            outline: 'none'
          }}
        >

          <IconButton
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              zIndex: 10,
              '&:hover': { 
                bgcolor: 'rgba(0,0,0,0.9)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            onClick={() => {
              setIsModalOpen(false);
              setZoom(1);
            }}
          >
            <Close />
          </IconButton>


          {images.length > 1 && (
            <IconButton
              sx={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                zIndex: 10,
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.9)',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={handlePrev}
            >
              <ChevronLeft />
            </IconButton>
          )}


          {images.length > 1 && (
            <IconButton
              sx={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                zIndex: 10,
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.9)',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={handleNext}
            >
              <ChevronRight />
            </IconButton>
          )}


          <Box
            sx={{
              position: 'absolute',
              top: 16,
              left: 16,
              display: 'flex',
              gap: 1,
              zIndex: 10
            }}
          >
            <IconButton
              sx={{
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.9)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out',
                '&:disabled': {
                  opacity: 0.5
                }
              }}
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
            >
              <ZoomOut />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.9)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out',
                '&:disabled': {
                  opacity: 0.5
                }
              }}
              onClick={handleZoomIn}
              disabled={zoom >= 3}
            >
              <ZoomIn />
            </IconButton>

            <IconButton
              sx={{
                bgcolor: 'rgba(0,0,0,0.7)',
                color: 'white',
                '&:hover': { 
                  bgcolor: 'rgba(0,0,0,0.9)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
              onClick={handleResetZoom}
            >
              <Fullscreen />
            </IconButton>
          </Box>


          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '95vh',
              width: '95vw',
              cursor: zoom > 1 ? 'grab' : 'pointer',
              '&:active': {
                cursor: zoom > 1 ? 'grabbing' : 'pointer'
              }
            }}
            onClick={handleResetZoom}
          >
            <img
              src={images[selectedImage]}
              alt={`Изображение ${selectedImage + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 8,
                transform: `scale(${zoom})`,
                transition: 'transform 0.3s ease-in-out',
                userSelect: 'none'
              }}
              draggable={false}
            />
          </Box>


          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 1,
              zIndex: 10
            }}
          >
            {images.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: index === selectedImage ? 
                    theme.palette.primary.main : 
                    'rgba(255, 255, 255, 0.5)',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: index === selectedImage ? 
                      theme.palette.primary.dark : 
                      'rgba(255, 255, 255, 0.7)',
                    transform: 'scale(1.2)'
                  }
                }}
                onClick={() => {
                  setSelectedImage(index);
                  setZoom(1);
                }}
              />
            ))}
          </Box>


          <Typography
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.7)',
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '0.875rem',
              backdropFilter: 'blur(4px)'
            }}
          >
            {selectedImage + 1} / {images.length}
            {zoom !== 1 && ` • ${Math.round(zoom * 100)}%`}
          </Typography>

 
          {!isMobile && (
            <Typography
              sx={{
                position: 'absolute',
                bottom: 60,
                left: '50%',
                transform: 'translateX(-50%)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.75rem',
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)',
                px: 2,
                py: 0.5,
                borderRadius: 1,
                backdropFilter: 'blur(4px)'
              }}
            >
              Используйте ← → для навигации, +/- для зума, Esc для выхода
            </Typography>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ImageGallery;