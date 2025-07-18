// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: '/api', // Use Vite proxy in development
    timeout: 15000,
  },
  production: {
    baseURL: 'https://snapspace-ry3k.onrender.com/api', // Direct API in production
    timeout: 30000,
  }
};

// Get current environment
const getCurrentEnvironment = () => {
  return import.meta.env.MODE || 'development';
};

// Get API configuration for current environment
export const getApiConfig = () => {
  const env = getCurrentEnvironment();
  return API_CONFIG[env] || API_CONFIG.development;
};

// Create API URL for a given endpoint
export const createApiUrl = (endpoint) => {
  const config = getApiConfig();
  return `${config.baseURL}${endpoint}`;
};

// Enhanced fetch with environment-aware configuration
export const apiFetch = async (endpoint, options = {}) => {
  const config = getApiConfig();
  const url = createApiUrl(endpoint);
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    timeout: config.timeout,
    ...options,
  };

  console.log(`[API] ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API functions
export const authApi = {
  adminLogin: async (credentials) => {
    const response = await apiFetch('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  checkHealth: async () => {
    try {
      const response = await apiFetch('/health', { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.warn('[Health Check] Server unavailable:', error.message);
      return false;
    }
  }
};

export default {
  getApiConfig,
  createApiUrl,
  apiFetch,
  authApi,
};
