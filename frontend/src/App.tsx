
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Layout from './components/common/Layout';
import ProgressBar from './components/common/ProgressBar';
import { AppThemeProvider } from './components/theme/ThemeContext';


import Listings from './pages/Listings';
import ModerationItem from './pages/ModerationItem';
import Statistics from './pages/Statistics';


const ScrollToTop = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};


const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/list" replace />} />
          <Route path="/list" element={
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Listings />
            </motion.div>
          } />
          <Route path="/item/:id" element={
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <ModerationItem />
            </motion.div>
          } />
          <Route path="/stats" element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Statistics />
            </motion.div>
          } />
          <Route path="/listings" element={<Navigate to="/list" replace />} />
          <Route path="/moderation/:id" element={<Navigate to="/item/:id" replace />} />
          <Route path="/statistics" element={<Navigate to="/stats" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  const [isLoading, setIsLoading] = React.useState(false);


  React.useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    window.addEventListener('beforeunload', handleStart);
    window.addEventListener('load', handleComplete);

    return () => {
      window.removeEventListener('beforeunload', handleStart);
      window.removeEventListener('load', handleComplete);
    };
  }, []);

  return (
    <AppThemeProvider>
      <CssBaseline />
      <Router>
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <ProgressBar isLoading={isLoading} />
          <Layout>
            <AnimatedRoutes />
          </Layout>
        </Box>
      </Router>
    </AppThemeProvider>
  );
}

export default App;