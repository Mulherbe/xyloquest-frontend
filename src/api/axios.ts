import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://xyloquest-backend.test/api',
  headers: {
    Accept: 'application/json',
  },
});

// Injecte le token automatiquement sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
