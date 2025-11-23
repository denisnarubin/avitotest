import React from 'react';
import { LinearProgress, Box } from '@mui/material';
import { keyframes } from '@emotion/react';


const progressAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

interface ProgressBarProps {
  isLoading?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ isLoading = false }) => {
  if (!isLoading) return null;

  return (
    <Box sx={{ width: '100%', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>
      <LinearProgress 
        sx={{
          height: 3,
          backgroundColor: 'transparent',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#1976d2',
            backgroundImage: `linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.15) 25%,
              transparent 25%,
              transparent 50%,
              rgba(255, 255, 255, 0.15) 50%,
              rgba(255, 255, 255, 0.15) 75%,
              transparent 75%,
              transparent
            )`,
            backgroundSize: '200px 100%',
            animation: `${progressAnimation} 1s linear infinite`,
          }
        }}
      />
    </Box>
  );
};

export default ProgressBar;