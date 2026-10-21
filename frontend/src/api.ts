import axios from 'axios';

const api = axios.create({
  // Set VITE_API_URL to the deployed backend, e.g. https://your-api.onrender.com/api
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
