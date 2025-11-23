import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';


const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

interface PageTransitionProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide';
  duration?: number;
  scrollToTop?: boolean;
}

const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  type = 'fade', 
  duration = 0.3,
  scrollToTop = true
}) => {
  const animation = type === 'slide' ? slideIn : fadeIn;


  useEffect(() => {
    if (scrollToTop) {
      window.scrollTo(0, 0);
    }
  }, [scrollToTop]);

  return (
    <Box
      sx={{
        animation: `${animation} ${duration}s ease-out`,
        minHeight: '100vh',
      }}
    >
      {children}
    </Box>
  );
};

export default PageTransition;