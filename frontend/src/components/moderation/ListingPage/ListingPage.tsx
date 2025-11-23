import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Pagination, Typography, Stack, Alert } from '@mui/material';
import type { Listing } from '../../../types';
import ListingFilters from './ListingFilters';
import ListingCard from './ListingCard';
import { useApi } from '../../../hooks/useApi';
import Loading from '../../common/Loading';
import AnimatedCard from '../../common/AnimatedCard';
import PageTransition from '../../common/PageTransition';

interface AdsResponse {
  ads: Listing[];
  pagination?: {
    totalItems: number;
  };
}

const ListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, loading, error } = useApi();
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '' as number | '',
    status: [] as string[],
    price: [0, 100000] as number[],
    sortBy: 'createdAt' as string,
    sortOrder: 'desc' as 'asc' | 'desc',
  });
  
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchAds = useCallback(async () => {
    try {
      const params = {
        page,
        limit,
        search: filters.search || undefined,
        categoryId: filters.categoryId || undefined,
        status: filters.status.length > 0 ? filters.status : undefined,
        minPrice: filters.price[0] > 0 ? filters.price[0] : undefined,
        maxPrice: filters.price[1] < 100000 ? filters.price[1] : undefined,
        sortBy: filters.sortBy || undefined,
        sortOrder: filters.sortOrder,
      };

      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await callApi<AdsResponse>('/api/v1/ads', { 
        method: 'get',
        params 
      });
      
      setListings(response.ads || []);
      setTotalItems(response.pagination?.totalItems || response.ads.length || 0);
    } catch (err) {
      console.error('Ошибка загрузки объявлений:', err);
      setListings([]);
      setTotalItems(0);
    }
  }, [filters, page, callApi]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleOpenItem = useCallback((id: number) => {
    navigate(`/item/${id}`);
  }, [navigate]);

  if (loading) return <Loading message="Загрузка объявлений..." />;

  return (
    <PageTransition type="fade" duration={0.4}>
      <Box p={3}>
        <Typography variant="h4" gutterBottom>
          Объявления
        </Typography>

        {error && (
          <AnimatedCard animation="appear" delay={0.1}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => {}}>
              {error}
            </Alert>
          </AnimatedCard>
        )}

        <AnimatedCard animation="appear" delay={0.2}>
          <ListingFilters filters={filters} onFiltersChange={handleFiltersChange} />
        </AnimatedCard>
        
        {listings.length === 0 && !loading ? (
          <AnimatedCard animation="appear" delay={0.3}>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                Объявления не найдены
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Попробуйте изменить параметры фильтрации
              </Typography>
            </Box>
          </AnimatedCard>
        ) : (
          <>
            <Stack spacing={2} mb={3}>
              {listings.map((item, index) => (
                <AnimatedCard key={item.id} index={index} animation="stagger" delay={0.3}>
                  <ListingCard 
                    item={item} 
                    onOpen={() => handleOpenItem(item.id)} 
                  />
                </AnimatedCard>
              ))}
            </Stack>

            <AnimatedCard animation="appear" delay={0.5 + listings.length * 0.1}>
              <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                {totalItems > limit && (
                  <Pagination
                    count={Math.ceil(totalItems / limit)}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    size="large"
                  />
                )}
                
                <Typography variant="body2" color="text.secondary">
                  Всего: {totalItems} объявлений
                </Typography>
              </Box>
            </AnimatedCard>
          </>
        )}
      </Box>
    </PageTransition>
  );
};

export default ListingPage;