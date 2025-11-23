
import React from 'react';
import { Button, Stack, Box, Typography } from '@mui/material';
import { Download, PictureAsPdf } from '@mui/icons-material';
import type { ExportData } from '../../../services/exportService';
import { exportToCSV, exportToPDF } from '../../../services/exportService';

interface ExportButtonsProps {
  exportData: ExportData;
  disabled?: boolean;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ 
  exportData, 
  disabled = false 
}) => {
  const handleCSVExport = () => {
    try {
      exportToCSV(exportData, `статистика_модерации_${exportData.period}`);
    } catch (error) {
      alert('Ошибка при экспорте в CSV. Пожалуйста, попробуйте еще раз.');
      console.error('CSV Export error:', error);
    }
  };

  const handlePDFExport = async () => {
    try {
      await exportToPDF(exportData, `статистика_модерации_${exportData.period}`);
    } catch (error) {
      alert('Ошибка при экспорте в PDF. Пожалуйста, попробуйте еще раз.');
      console.error('PDF Export error:', error);
    }
  };

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, backgroundColor: 'background.paper' }}>
      <Typography variant="h6" gutterBottom>
        Экспорт данных
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Скачайте отчет о модерации за выбранный период
      </Typography>
      
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleCSVExport}
          disabled={disabled}
          sx={{ borderRadius: 2 }}
        >
          CSV
        </Button>
        
        <Button
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={handlePDFExport}
          disabled={disabled}
          sx={{ 
            borderRadius: 2,
            backgroundColor: '#d32f2f',
            '&:hover': {
              backgroundColor: '#b71c1c',
            }
          }}
        >
          PDF
        </Button>
      </Stack>
    </Box>
  );
};

export default ExportButtons;