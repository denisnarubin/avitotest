import React from 'react';
import { Stack, Card, CardContent, Typography, Chip } from '@mui/material';
import { formatAverageTime } from '../../../utils/formatters';

interface StatsCardsProps {
  totalChecked: number;
  approvedPercent: number;
  rejectedPercent: number;
  requestChangesPercent: number;
  avgTime: number; 
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalChecked,
  approvedPercent,
  rejectedPercent,
  requestChangesPercent,
  avgTime,
}) => {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      flexWrap="wrap"
      useFlexGap
      mb={4}
    >
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Проверено объявлений
          </Typography>
          <Typography variant="h4" color="primary">
            {totalChecked}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Одобрено
          </Typography>
          <Chip 
            label={`${approvedPercent.toFixed(1)}%`} 
            color="success" 
            variant="outlined"
          />
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Отклонено
          </Typography>
          <Chip 
            label={`${rejectedPercent.toFixed(1)}%`} 
            color="error" 
            variant="outlined"
          />
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            На доработку
          </Typography>
          <Chip 
            label={`${requestChangesPercent.toFixed(1)}%`} 
            color="warning" 
            variant="outlined"
          />
        </CardContent>
      </Card>
      
      <Card sx={{ flex: '1 1 200px', minWidth: 200 }}>
        <CardContent>
          <Typography variant="subtitle2" color="textSecondary" gutterBottom>
            Среднее время проверки
          </Typography>
          <Typography variant="h6">{formatAverageTime(avgTime)}</Typography>
          <Typography variant="caption" color="textSecondary">
            {avgTime} сек
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default StatsCards;