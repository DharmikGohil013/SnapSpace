import axios, { AxiosResponse } from 'axios';
import { User, Tile, DashboardStats, ApiResponse, LoginResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth Services
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    console.log('API Service: Making login request to:', `${API_BASE_URL}/auth/login`);
    console.log('API Service: Login data:', { email, password: '***' });
    
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await api.post('/auth/login', {
        email,
        password,
      });
      console.log('API Service: Login response:', response.data);
      return response.data.data!;
    } catch (error) {
      console.error('API Service: Login error:', error);
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.get('/auth/me');
    return response.data.data!.user;
  },

  makeAdmin: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = await api.patch('/auth/make-admin');
    return response.data.data!.user;
  }
};

// Admin Services
export const adminService = {
  // Dashboard
  getStats: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = await api.get('/admin/stats');
    return response.data.data!;
  },

  // Tiles
  getAllTiles: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<{ tiles: Tile[]; pagination: any }> => {
    const response: AxiosResponse<ApiResponse<Tile[]>> = await api.get('/admin/tiles', { params });
    return {
      tiles: response.data.data!,
      pagination: response.data.pagination
    };
  },

  createTile: async (tileData: Partial<Tile>): Promise<Tile> => {
    const response: AxiosResponse<ApiResponse<Tile>> = await api.post('/admin/tiles', tileData);
    return response.data.data!;
  },

  updateTile: async (id: string, tileData: Partial<Tile>): Promise<Tile> => {
    const response: AxiosResponse<ApiResponse<Tile>> = await api.put(`/admin/tiles/${id}`, tileData);
    return response.data.data!;
  },

  deleteTile: async (id: string): Promise<void> => {
    await api.delete(`/admin/tiles/${id}`);
  },

  toggleFeatured: async (id: string): Promise<Tile> => {
    const response: AxiosResponse<ApiResponse<Tile>> = await api.patch(`/admin/tiles/${id}/featured`);
    return response.data.data!;
  },

  // Users
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }): Promise<{ users: User[]; pagination: any }> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/admin/users', { params });
    return {
      users: response.data.data!,
      pagination: response.data.pagination
    };
  },

  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'user' | 'admin';
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  }): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/admin/users', userData);
    return response.data.data!;
  },

  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.put(`/admin/users/${id}`, userData);
    return response.data.data!;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  updateUserRole: async (id: string, role: 'user' | 'admin'): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data.data!;
  }
};

// Public Tile Services
export const tileService = {
  getAllTiles: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ tiles: Tile[]; pagination: any }> => {
    const response: AxiosResponse<ApiResponse<Tile[]>> = await api.get('/tiles', { params });
    return {
      tiles: response.data.data!,
      pagination: response.data.pagination
    };
  },

  getTile: async (id: string): Promise<Tile> => {
    const response: AxiosResponse<ApiResponse<Tile>> = await api.get(`/tiles/${id}`);
    return response.data.data!;
  },

  getFeaturedTiles: async (): Promise<Tile[]> => {
    const response: AxiosResponse<ApiResponse<Tile[]>> = await api.get('/tiles/featured');
    return response.data.data!;
  }
};

export default api;
