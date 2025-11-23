import { useState, useCallback } from 'react';
import axios from 'axios';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = useCallback(async <T>(
    url: string,
    config?: {
      data?: any;
      method?: 'get' | 'post' | 'put' | 'delete';
      params?: Record<string, any>;
    }
  ): Promise<T> => {
    try {
      setLoading(true);
      setError(null);
      const { data, method = 'get', params } = config || {};
      
      const response = await axios({ 
        method, 
        url, 
        data,
        params 
      });
      
      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Ошибка API';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};