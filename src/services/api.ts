import axios, { AxiosResponse } from 'axios';
import { API_CONFIG } from '../config/api';
import { useAuthStore } from '../store/useAuthStore'; // <-- Import the store

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- MODIFIED: Add a request interceptor ---
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from the Zustand store
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      throw new Error('Resource not found');
    } else if (error.response?.status === 500) {
      throw new Error('Internal server error');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 