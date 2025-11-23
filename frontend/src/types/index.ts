export type ModerationStatus = 'Одобрено' | 'Отклонено' | 'Доработка';

export interface ModerationHistory {
  moderator: string;
  date: string;
  status: ModerationStatus;
  comment?: string;
}

export interface SellerInfo {
  name: string;
  rating: string;
  yearsOnSite: string; 
  adsCount: number;
  registeredAt: string;
}

export interface ItemModerationViewProps {
  title: string;
  price: number;
  galleryCount: number;
  images: string[];
  description: string;
  characteristics: Record<string, string>;
  seller: SellerInfo;
  moderationHistory: ModerationHistory[];
  onApprove: () => void;
  onReject: (reason: string, comment?: string) => void;
  onRequestRevision: (reason: string, comment?: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export interface ApiAdvertisement {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  categoryId: number;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  priority: 'normal' | 'urgent';
  createdAt: string;
  updatedAt: string;
  images: string[];
  seller: {
    id: number;
    name: string;
    rating: string;
    totalAds: number;
    registeredAt: string;
  };
  characteristics: Record<string, string>;
  moderationHistory: {
    id: number;
    moderatorId: number;
    moderatorName: string;
    action: 'approved' | 'rejected' | 'requestChanges';
    reason: string | null;
    comment: string;
    timestamp: string;
  }[];
}

export interface Listing {
  id: number;
  title: string;
  price: number;
  category: string;
  categoryId: number;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'draft';
  priority: 'normal' | 'urgent';
  images?: string[];
}

export interface ActivityResponse {
  date: string;
  approved: number;
  rejected: number;
  requestChanges: number;
  total?: number;
}

export interface FormattedActivityData {
  date: string;
  day: string;
  approved: number;
  rejected: number;
  requestChanges: number;
  total: number;
}

export interface PieDataItem {
  name: string;
  value: number;
  percent?: number;
  [key: string]: any;
}

export interface CategoryDataItem {
  category: string;
  count: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

