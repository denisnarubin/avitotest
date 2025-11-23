import React, { useState, useEffect } from 'react';
import {
  Stack,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Checkbox,
  ListItemText,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Typography,
  Box,
  InputAdornment,
} from '@mui/material';

const categories = [

  { id: 1, name: 'Недвижимость' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Работа' },
  { id: 4, name: 'Услуги' },
  { id: 5, name: 'Животные' },
  { id: 6, name: 'Мода' },
  { id: 7, name: 'Детское' }
];

const statuses = [
  { value: 'pending', label: 'На модерации' },
  { value: 'approved', label: 'Одобрено' },
  { value: 'rejected', label: 'Отклонено' },
  { value: 'draft', label: 'Черновик' }
];

interface Filters {
  search: string;
  categoryId: number | '';
  status: string[];
  price: number[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface ListingFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

const defaultFilters: Filters = {
  search: '',
  categoryId: '',
  status: [],
  price: [0, 100000],
  sortBy: '', 
  sortOrder: 'desc', 
};

const ListingFilters: React.FC<ListingFiltersProps> = ({ filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleLocalFilterChange = (key: keyof Filters, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const resetFilters = () => {
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const minValue = Math.max(0, Math.min(Number(e.target.value), localFilters.price[1] - 1000));
    handleLocalFilterChange('price', [minValue, localFilters.price[1]]);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxValue = Math.min(100000, Math.max(Number(e.target.value), localFilters.price[0] + 1000));
    handleLocalFilterChange('price', [localFilters.price[0], maxValue]);
  };

  return (
    <Stack spacing={3} mb={3}>

      <TextField
        label="Поиск по объявлениям"
        value={localFilters.search}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
          handleLocalFilterChange('search', e.target.value)
        }
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            applyFilters();
          }
        }}
        variant="outlined"
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: 'primary.main',
            },
          }
        }}
      />


      <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
        <FormControl fullWidth size="small">
          <InputLabel>Категория</InputLabel>
          <Select
            value={localFilters.categoryId}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 0 || value === 1 || value === 2 || value === 3 || value === 4 || value === 5 || value === 6 || value === 7) {
                handleLocalFilterChange('categoryId', value);
              } else {
                handleLocalFilterChange('categoryId', '');
              }
            }}
            label="Категория"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            <MenuItem value={''}><em>Все категории</em></MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            multiple
            value={localFilters.status}
            onChange={(e) => handleLocalFilterChange('status', e.target.value as string[])}
            renderValue={(selected: string[]) => 
              selected.map(s => statuses.find(status => status.value === s)?.label || s).join(', ')
            }
            label="Статус"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
              },
            }}
          >
            {statuses.map(status => (
              <MenuItem key={status.value} value={status.value}>
                <Checkbox 
                  checked={localFilters.status.includes(status.value)} 
                  size="small"
                  sx={{ py: 0 }}
                />
                <ListItemText 
                  primary={status.label} 
                  sx={{ '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>


      <Box 
        sx={{ 
          p: 2, 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Диапазон цен
        </Typography>
        

        <Box display="flex" gap={2} mb={2}>
          <TextField
            label="От"
            type="number"
            value={localFilters.price[0]}
            onChange={handleMinPriceChange}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
          <TextField
            label="До"
            type="number"
            value={localFilters.price[1]}
            onChange={handleMaxPriceChange}
            size="small"
            fullWidth
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">₽</InputAdornment>,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 1,
              }
            }}
          />
        </Box>


        <Slider
          value={localFilters.price}
          onChange={(_, val) => handleLocalFilterChange('price', val)}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toLocaleString()} ₽`}
          min={0}
          max={100000}
          step={1000}
          sx={{
            color: 'primary.main',
            '& .MuiSlider-valueLabel': {
              backgroundColor: 'primary.main',
              borderRadius: 1,
              fontSize: '0.75rem',
            }
          }}
        />
        

        <Box display="flex" gap={1} mt={2} flexWrap="wrap">
          {[
            { label: 'До 10 тыс', value: [0, 10000] },
            { label: '10-25 тыс', value: [10000, 25000] },
            { label: '25-50 тыс', value: [25000, 50000] },
            { label: '50-100 тыс', value: [50000, 100000] }
          ].map((preset) => (
            <Button
              key={preset.label}
              variant="outlined"
              size="small"
              onClick={() => handleLocalFilterChange('price', preset.value)}
              sx={{
                borderRadius: 1,
                fontSize: '0.75rem',
                py: 0.5,
                borderColor: 
                  localFilters.price[0] === preset.value[0] && localFilters.price[1] === preset.value[1] 
                    ? 'primary.main' 
                    : 'divider',
                backgroundColor: 
                  localFilters.price[0] === preset.value[0] && localFilters.price[1] === preset.value[1] 
                    ? 'primary.light' 
                    : 'transparent',
              }}
            >
              {preset.label}
            </Button>
          ))}
        </Box>
      </Box>


      <Box 
        sx={{ 
          p: 2, 
          border: 1, 
          borderColor: 'divider', 
          borderRadius: 2,
          backgroundColor: 'background.paper'
        }}
      >
        <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
          Сортировка
        </Typography>
        <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
          <ToggleButtonGroup
            value={localFilters.sortBy}
            onChange={(_, val) => val && handleLocalFilterChange('sortBy', val)}
            exclusive
            size="small"
          >
            <ToggleButton value="createdAt" sx={{ borderRadius: 1 }}>
              По дате
            </ToggleButton>
            <ToggleButton value="price" sx={{ borderRadius: 1 }}>
              По цене
            </ToggleButton>
            <ToggleButton value="priority" sx={{ borderRadius: 1 }}>
              По приоритету
            </ToggleButton>
          </ToggleButtonGroup>
          
          <ToggleButtonGroup
            value={localFilters.sortOrder}
            onChange={(_, val) => val && handleLocalFilterChange('sortOrder', val)}
            exclusive
            disabled={!localFilters.sortBy}
            size="small"
          >
            <ToggleButton value="asc" sx={{ borderRadius: 1, minWidth: 40 }}>
              ↑
            </ToggleButton>
            <ToggleButton value="desc" sx={{ borderRadius: 1, minWidth: 40 }}>
              ↓
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>


      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button 
          variant="outlined" 
          onClick={resetFilters}
          size="medium"
          sx={{ 
            borderRadius: 2,
            px: 3
          }}
        >
          Сбросить
        </Button>
        <Button 
          variant="contained" 
          onClick={applyFilters}
          size="medium"
          sx={{ 
            borderRadius: 2,
            px: 4,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            }
          }}
        >
          Применить фильтры
        </Button>
      </Box>
    </Stack>
  );
};

export default ListingFilters;