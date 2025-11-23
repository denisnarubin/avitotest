import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeToggle } from '../theme/ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const navigationItems = [
    { path: '/stats', label: 'Статистика' }
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {navigationItems.map((item) => (
          <ListItem 
            key={item.path}
            component={Link}
            to={item.path}
            sx={{
              backgroundColor: location.pathname === item.path ? 
                theme.palette.action.selected : 'transparent',
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      transition: 'all 0.3s ease-in-out'
    }}>
      <AppBar position="sticky" elevation={2}>
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography 
            variant={isSmallMobile ? "h6" : "h5"} 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
            }}
          >
            {isSmallMobile ? 'Модерация' : 'Модерация объявлений'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {!isMobile ? (
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/stats"
                  variant={location.pathname === '/stats' ? 'outlined' : 'text'}
                  size="small"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                    fontSize: { xs: '0.8rem', sm: '0.875rem' }
                  }}
                >
                  Статистика
                </Button>
                <ThemeToggle variant="icon" />
              </>
            ) : (
              <ThemeToggle variant="icon" />
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      
      <Container 
        maxWidth="xl" 
        sx={{ 
          py: { xs: 1, sm: 2 },
          px: { xs: 1, sm: 2 },
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;