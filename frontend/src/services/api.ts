import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});


// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aiia_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear credentials if token expired
      if (localStorage.getItem('aiia_token')) {
        localStorage.removeItem('aiia_token');
        localStorage.removeItem('aiia_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
