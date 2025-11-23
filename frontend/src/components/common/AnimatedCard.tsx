import React from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';


const cardAppear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(50px);
  }
  60% {
    transform: scale(1.05) translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

const cardStagger = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-30px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`;

interface AnimatedCardProps {
  children: React.ReactNode;
  index?: number;
  animation?: 'appear' | 'stagger';
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({ 
  children, 
  index = 0,
  animation = 'appear',
  delay = 0 
}) => {
  const getAnimation = () => {
    if (animation === 'stagger') {
      return `${cardStagger} 0.5s ease-out ${index * 0.1 + delay}s both`;
    }
    return `${cardAppear} 0.6s ease-out ${index * 0.1 + delay}s both`;
  };

  return (
    <Box
      sx={{
        animation: getAnimation(),
        opacity: 0, 
        transform: animation === 'stagger' ? 'translateX(-30px)' : 'scale(0.8) translateY(50px)',
      }}
    >
      {children}
    </Box>
  );
};

export default AnimatedCard;