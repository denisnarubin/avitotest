import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Button,
  Box,
} from '@mui/material';
import type { Listing } from '../../../types';
import { getStatusColor, getStatusText } from '../../../utils/formatters';

interface ListingCardProps {
  item: Listing;
  onOpen: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ item, onOpen }) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Card>
        <Stack direction="row" spacing={2}>
          <CardMedia
            component="img"
            sx={{ width: 200 }}
            image={item.images?.[0] || '/placeholder.jpg'}
            alt={item.title}
          />
          
          <CardContent sx={{ flex: 1 }}>
            <Box
              mt={2}
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
              flexDirection={{ xs: 'column', md: 'row' }} 
            >
              <Box>
                <Typography variant="h6">{item.title}</Typography>
                <Typography color="text.secondary">{item.price} ₽</Typography>
                <Typography variant="body2">
                  {item.category || `Категория #${item.categoryId}`} • {new Date(item.createdAt).toLocaleDateString()}
                </Typography>

                <Stack direction="row" spacing={1} mt={1}>
                  <Chip 
                    label={getStatusText(item.status)} 
                    color={getStatusColor(item.status)} 
                    size="small"
                  />
                  <Chip 
                    label={item.priority === 'urgent' ? 'Срочный' : 'Обычный'} 
                    variant="outlined" 
                    size="small"
                  />
                </Stack>
              </Box>

              <Box mt={{ xs: 2, md: 0 }} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                <Button variant="contained" onClick={onOpen}>
                  Открыть
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Stack>
      </Card>
    </Box>
  );
};

export default ListingCard;