import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
export const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:8000/graphql';
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'development';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `JWT ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response) {
      const { status, data } = response;

      // Log API errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', {
          status,
          message: data?.detail || data?.message || 'Unknown error',
          endpoint: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          requestData: error.config?.data
        });
      }

      // Handle authentication errors (401)
      if (status === 401) {
        console.warn('Authentication error - redirecting to login');
        // Clear token and redirect to login
        localStorage.removeItem('adminToken');
        // Use window.location for full page redirect to ensure clean state
        window.location.href = '/login';
        return Promise.reject(error);
      }

      // Handle other client/server errors (4xx, 5xx)
      if (status >= 400) {
        // Log structured error for monitoring
        console.error(`API Error [${status}]:`, {
          endpoint: error.config?.url,
          method: error.config?.method?.toUpperCase(),
          error: data?.detail || data?.message || 'Unknown API error'
        });
      }
    } else {
      // Network error or no response
      console.error('Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;