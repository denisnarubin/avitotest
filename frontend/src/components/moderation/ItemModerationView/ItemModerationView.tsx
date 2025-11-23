
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Divider,
  Stack,
  Chip,
  Rating,
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { ItemModerationViewProps } from '../../../types/index';
import ModerationActions from './ModerationActions';
import { getAdsCountText } from '../../../utils/formatters';
import ImageGallery from './ImageGallery';

const ItemModerationView: React.FC<ItemModerationViewProps> = ({
  title,
  price,
  images,
  description,
  characteristics,
  seller,
  moderationHistory,
  onApprove,
  onReject,
  onRequestRevision,
  onPrev,
  onNext,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Box p={2}>

      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          {title}
        </Typography>
        <Typography variant="h5" color="primary" fontWeight="bold">
          {price.toLocaleString('ru-RU')} ₽
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Категория: {Object.keys(characteristics).includes('Категория') 
            ? characteristics['Категория'] 
            : 'Не указана'}
        </Typography>
      </Paper>


      <Box display="flex" gap={3} mt={2} flexWrap="wrap">

        <Box flex={{ xs: '1 1 100%', md: '1 1 35%' }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <ImageGallery images={images} />
          </Paper>
        </Box>


        <Box flex={{ xs: '1 1 100%', md: '1 1 60%' }}>
          <Paper elevation={2} sx={{ 
            p: 3, 
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : '#fffbe6',
            border: theme.palette.mode === 'dark' ? '1px solid' : 'none',
            borderColor: theme.palette.mode === 'dark' ? 'grey.700' : 'transparent'
          }}>
            <Typography variant="h6" gutterBottom>
              История модерации
            </Typography>
            {moderationHistory.length > 0 ? (
              <Stack spacing={2}>
                {moderationHistory.map((history, index) => (
                  <Box 
                    key={index} 
                    sx={{ 
                      p: 2, 
                      border: '1px solid', 
                      borderColor: theme.palette.mode === 'dark' ? 'grey.700' : '#e0e0e0',
                      borderRadius: 2,
                      backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'white'
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="subtitle2" fontWeight="bold" color="text.primary">
                        {history.moderator}
                      </Typography>
                      <Chip 
                        label={history.status} 
                        size="small" 
                        color={
                          history.status === 'Одобрено' ? 'success' :
                          history.status === 'Отклонено' ? 'error' : 'warning'
                        }
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {history.date}
                    </Typography>
                    {history.comment && (
                      <Typography variant="body2" sx={{ 
                        mt: 1, 
                        p: 1, 
                        bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : '#f5f5f5', 
                        borderRadius: 1,
                        color: theme.palette.mode === 'dark' ? 'grey.100' : 'text.primary'
                      }}>
                        <strong>Комментарий:</strong> {history.comment}
                      </Typography>
                    )}
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                История модерации отсутствует
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>


      <Box mt={3}>
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Полное описание
          </Typography>
          <Typography 
            variant="body1" 
            mb={3} 
            sx={{ 
              whiteSpace: 'pre-wrap', 
              lineHeight: 1.6,
              fontSize: '1rem',
              color: 'text.primary'
            }}
          >
            {description}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Характеристики
          </Typography>
          <Table size="medium" sx={{ mt: 2 }}>
            <TableBody>
              {Object.entries(characteristics).map(([key, value]) => (
                <TableRow key={key} hover sx={{ 
                  '&:hover': {
                    backgroundColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.50'
                  }
                }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 'bold', 
                      width: '30%', 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontSize: '0.95rem',
                      color: 'text.primary'
                    }}
                  >
                    {key}
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      fontSize: '0.95rem',
                      color: 'text.primary'
                    }}
                  >
                    {value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Информация о продавце
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium" color="text.primary">
                Имя продавца:
              </Typography>
              <Typography variant="body1" color="text.primary">{seller.name}</Typography>
            </Box>
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium" color="text.primary">
                Рейтинг:
              </Typography>
              <Box display="flex" alignItems="center">
                <Rating 
                  value={parseFloat(seller.rating)} 
                  precision={0.1} 
                  size="small" 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1, minWidth: 40 }} color="text.primary">
                  ({seller.rating})
                </Typography>
              </Box>
            </Box>
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium" color="text.primary">
                Количество объявлений:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {seller.adsCount} {getAdsCountText(seller.adsCount)}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium" color="text.primary">
                На сайте:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {seller.yearsOnSite}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="body1" fontWeight="medium" color="text.primary">
                Дата регистрации:
              </Typography>
              <Typography variant="body1" color="text.primary">
                {new Date(seller.registeredAt).toLocaleDateString('ru-RU')}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>


      <ModerationActions
        onApprove={onApprove}
        onReject={onReject}
        onRequestRevision={onRequestRevision}

      />


      <Stack direction="row" spacing={2} mt={3} justifyContent="center" alignItems="center">
        <Button 
          variant="outlined" 
          onClick={() => navigate('/list')}
          sx={{ minWidth: 140 }}
        >
          Назад к списку
        </Button>
        <Button 
          variant="outlined" 
          onClick={onPrev}
          sx={{ minWidth: 140 }}
        >
          ← Предыдущее
        </Button>
        <Button 
          variant="outlined" 
          onClick={onNext}
          sx={{ minWidth: 140 }}
        >
          Следующее →
        </Button>
      </Stack>
    </Box>
  );
};

export default ItemModerationView;