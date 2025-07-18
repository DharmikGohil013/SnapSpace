import axios from './axios';

const AUTH_BASE = '/auth';

// Retry function for failed requests
const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      console.log(`Request attempt ${i + 1} failed:`, error.message);
      if (i === maxRetries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// User Auth APIs
export const requestOtp = (data) => retryRequest(() => axios.post(`${AUTH_BASE}/user/request-otp`, data));
export const verifyOtp = (data) => retryRequest(() => axios.post(`${AUTH_BASE}/user/verify-otp`, data));
export const loginUser = (data) => retryRequest(() => axios.post(`${AUTH_BASE}/user/login`, data));

// Admin Auth APIs
export const loginAdmin = (data) => retryRequest(() => axios.post(`${AUTH_BASE}/admin/login`, data));
export const registerAdmin = (data) => retryRequest(() => axios.post(`${AUTH_BASE}/admin/register`, data));

// Token storage
export const saveToken = (token) => localStorage.setItem('snapspace_token', token);
export const getToken = () => localStorage.getItem('snapspace_token');
export const removeToken = () => localStorage.removeItem('snapspace_token');

// Attach token to header if needed
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Health check function
export const checkServerHealth = async () => {
  try {
    const response = await axios.get('/health', { timeout: 10000 });
    return response.status === 200;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
};
