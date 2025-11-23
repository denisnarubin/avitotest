
import React from 'react';
import {
  IconButton,
  Tooltip,
  Box,
  FormControlLabel,
  Switch,
  useMediaQuery,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme } from './ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'switch';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'icon',
  showLabel = false 
}) => {
  const { themeMode, toggleTheme } = useTheme();
  const isMobile = useMediaQuery('(max-width:600px)');

  if (variant === 'switch') {
    return (
      <Box display="flex" alignItems="center">
        <FormControlLabel
          control={
            <Switch
              checked={themeMode === 'dark'}
              onChange={toggleTheme}
              color="primary"
            />
          }
          label={showLabel ? (themeMode === 'dark' ? 'Тёмная' : 'Светлая') : ''}
          labelPlacement="start"
        />
      </Box>
    );
  }

  return (
    <Tooltip title={themeMode === 'dark' ? 'Светлая тема' : 'Тёмная тема'}>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size={isMobile ? "small" : "medium"}
        sx={{
          ml: 1,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'rotate(180deg)',
            backgroundColor: 'rgba(255,255,255,0.1)',
          },
        }}
      >
        {themeMode === 'dark' ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};