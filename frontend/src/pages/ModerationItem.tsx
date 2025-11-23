import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import ItemModerationView from '../components/moderation/ItemModerationView/ItemModerationView';
import type { ApiAdvertisement } from '../types';
import { useApi } from '../hooks/useApi';
import Loading from '../components/common/Loading';
import { formatTimeOnSite } from '../utils/formatters';
import PageTransition from '../components/common/PageTransition';

const ModerationItem = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { callApi, loading, error } = useApi();
  const [ad, setAd] = useState<ApiAdvertisement | null>(null);

  useEffect(() => {
    const fetchAd = async () => {
      if (!id) return;
      
      try {
        const response = await callApi<ApiAdvertisement>(`/api/v1/ads/${id}`);
        setAd(response);
      } catch (err) {
        console.error('Ошибка загрузки объявления:', err);
      }
    };

    fetchAd();
  }, [id, callApi]);

  const handleApiCall = async (
    url: string,
    data?: any,
    method: 'post' | 'put' | 'delete' = 'post'
  ) => {
    try {
      await callApi(url, { method, data });
      
      setTimeout(async () => {
        if (id) {
          const response = await callApi<ApiAdvertisement>(`/api/v1/ads/${id}`);
          setAd(response);
        }
      }, 500);
      
    } catch (err) {
      console.error('Ошибка API:', err);
      throw err;
    }
  };

  const handlePrev = () => {
    if (id) {
      const prevId = parseInt(id) - 1;
      if (prevId > 0) {
        navigate(`/item/${prevId}`);
      }
    }
  };

  const handleNext = () => {
    if (id) {
      const nextId = parseInt(id) + 1;
      navigate(`/item/${nextId}`);
    }
  };

  if (loading) return <Loading message="Загрузка объявления..." />;
  
  if (error) {
    return (
      <PageTransition type="fade">
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </PageTransition>
    );
  }

  if (!ad) {
    return (
      <PageTransition type="fade">
        <Box p={3}>
          <Alert severity="warning">Объявление не найдено</Alert>
        </Box>
      </PageTransition>
    );
  }

  return (
    <PageTransition type="slide" duration={0.4}>
      <Box>
        <ItemModerationView
          title={ad.title}
          price={ad.price}
          galleryCount={ad.images.length}
          images={ad.images}
          description={ad.description}
          characteristics={ad.characteristics}
          seller={{
            name: ad.seller.name,
            rating: ad.seller.rating,
            yearsOnSite: formatTimeOnSite(ad.seller.registeredAt),
            adsCount: ad.seller.totalAds,
            registeredAt: ad.seller.registeredAt
          }}
          moderationHistory={ad.moderationHistory.map(history => ({
            moderator: history.moderatorName,
            date: new Date(history.timestamp).toLocaleString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            status:
              history.action === 'approved' ? 'Одобрено' :
              history.action === 'rejected' ? 'Отклонено' : 'Доработка',
            comment: history.comment
          }))}
          onApprove={() => handleApiCall(`/api/v1/ads/${ad.id}/approve`)}
          onReject={(reason, comment) =>
            handleApiCall(`/api/v1/ads/${ad.id}/reject`, { 
              reason: reason,
              comment: comment
            })
          }
          onRequestRevision={(reason, comment) =>
            handleApiCall(`/api/v1/ads/${ad.id}/request-changes`, { 
              reason: reason,
              comment: comment
            })
          }
          onPrev={handlePrev}
          onNext={handleNext}
        />
      </Box>
    </PageTransition>
  );
};

export default ModerationItem;