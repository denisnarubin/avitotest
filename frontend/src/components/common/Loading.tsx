import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingProps {
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ message = 'Загрузка...' }) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight={200}>
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>
    </Box>
  );
};

export default Loading;