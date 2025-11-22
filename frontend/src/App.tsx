// App.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import ItemModerationView from "./Item";
import ListingPage from "./ListingCard";
import ModeratorStats from "./ModeratorStats";

interface ApiAdvertisement {
  id: number;
  title: string;
  description: string;
  images: string[];
  characteristics: Record<string, string>;
  seller: {
    name: string;
    totalAds: number;
    registeredAt: string;
  };
  moderationHistory: {
    moderatorName: string;
    timestamp: string;
    action: string;
  }[];
}

function App() {
  const [ad, setAd] = useState<ApiAdvertisement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adId, setAdId] = useState(1); // текущий ID объявления

  const fetchAd = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/v1/ads/${id}`);
      setAd(response.data);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || "Ошибка загрузки данных");
      } else {
        setError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAd(adId);
  }, [adId]);

  const handleApiCall = async (
    url: string,
    data?: any,
    method: "post" | "put" | "delete" = "post"
  ) => {
    try {
      const response = await axios({ method, url, data });
      console.log("Успех:", response.data);
      // Обновляем объявление после успешного действия
      fetchAd(adId);
      return response.data;
    } catch (err) {
      console.error("Ошибка API:", err);
      if (axios.isAxiosError(err)) {
        alert(`Ошибка: ${err.response?.data?.message || err.message}`);
      }
      throw err;
    }
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  if (!ad) {
    return <div>Объявление не найдено</div>;
  }

  const lastHistory =
    ad.moderationHistory.length > 0
      ? ad.moderationHistory[ad.moderationHistory.length - 1]
      : {
          moderatorName: "Не назначен",
          timestamp: new Date().toISOString(),
          action: "pending",
        };

  const yearsOnSite =
    new Date().getFullYear() - new Date(ad.seller.registeredAt).getFullYear();

  return (
    <>
    
      <ItemModerationView
        galleryCount={ad.images.length}
        description={ad.description}
        characteristics={ad.characteristics}
        seller={{
          name: ad.seller.name,
          yearsOnSite: yearsOnSite,
          adsCount: ad.seller.totalAds,
        }}
        moderationHistory={{
          moderator: lastHistory.moderatorName,
          date: new Date(lastHistory.timestamp).toLocaleString("ru-RU"),
          status:
            lastHistory.action === "approved"
              ? "Одобрено"
              : lastHistory.action === "rejected"
              ? "Отклонено"
              : "Доработка",
        }}
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
        onPrev={() => setAdId((prev) => Math.max(prev - 1, 1))}
        onNext={() => setAdId((prev) => prev + 1)}
      />
      <ListingPage />
      <ModeratorStats />
    </>
  );
}

export default App;