// src/utils/axiosConfig.js
import axios from 'axios';

// Set default base URL if needed
// axios.defaults.baseURL = 'https://backend.app20.in';

// Request interceptor to add token to every request
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor for token refresh
axios.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // If error is 401 Unauthorized and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                // Get refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                
                if (!refreshToken) {
                    // No refresh token available, redirect to login
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
                
                // Call refresh token endpoint
                const response = await axios.post(
                    'https://backend.app20.in/api/token/refresh/',
                    { refresh: refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        skipAuthRefresh: true, // Skip interceptor for this call
                    }
                );
                
                if (response.status === 200) {
                    // Update access token in localStorage
                    localStorage.setItem('accessToken', response.data.access);
                    
                    // Update Authorization header
                    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    
                    // Retry original request
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // If refresh fails, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

// src/utils/axiosConfig.js
export const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
  return {
    'Content-Type': 'application/json'
  };
};

export default axios;