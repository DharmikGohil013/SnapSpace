// API Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Tile {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: Array<{
    url: string;
    altText?: string;
  }>;
  specifications: {
    size: {
      length: number;
      width: number;
      thickness: number;
      unit: string;
    };
    material: string;
    finish: string;
    color: string;
    pattern: string;
    usage: string[];
  };
  inventory: {
    stock: number;
    unit: string;
    lowStockAlert: number;
  };
  ratings: {
    average: number;
    count: number;
  };
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  tiles: {
    total: number;
    active: number;
    featured: number;
    recent: number;
  };
  users: {
    total: number;
    admins: number;
    verified: number;
    recent: number;
  };
  carts: {
    total: number;
    withItems: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: {
    current: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}
