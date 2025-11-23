
export const getYearsText = (years: number): string => {
    if (years % 10 === 1 && years % 100 !== 11) return 'год';
    if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) return 'года';
    return 'лет';
  };
  
  export const getMonthsText = (months: number): string => {
    if (months % 10 === 1 && months % 100 !== 11) return 'месяц';
    if ([2, 3, 4].includes(months % 10) && ![12, 13, 14].includes(months % 100)) return 'месяца';
    return 'месяцев';
  };
  
  export const getAdsCountText = (count: number): string => {
    if (count % 10 === 1 && count % 100 !== 11) return 'объявление';
    if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) return 'объявления';
    return 'объявлений';
  };
  
  export const getStatusColor = (status: string): "success" | "warning" | "error" | "default" => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      case 'draft': return 'default';
      default: return 'default';
    }
  };
  
  export const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'На модерации';
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      case 'draft': return 'Черновик';
      default: return status;
    }
  };
  
  export const formatPrice = (price: number): string => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };
  
  export const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  export const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatTimeOnSite = (registeredAt: string): string => {
    const registered = new Date(registeredAt);
    const now = new Date();
    
    const diffMs = now.getTime() - registered.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    let result = '';
    
    if (years > 0) {
      result += `${years} ${getYearsText(years)}`;
    }
    
    if (months > 0) {
      if (years > 0) {
        result += ' ';
      }
      result += `${months} ${getMonthsText(months)}`;
    }
    
    if (result === '') {
      result = 'менее месяца';
    }
    
    return result;
  };
  
  export const formatAverageTime = (seconds: number): string => {
    if (seconds <= 0) return '0 мин';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0 && minutes > 0) {
      return `${hours} ч ${minutes} мин`;
    } else if (hours > 0) {
      return `${hours} ч`;
    } else {
      return `${minutes} мин`;
    }
  };