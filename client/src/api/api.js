
import axios from 'axios';
'

const api = axios.create({
  baseURL: 'https://event-board-api.onrender.com',
});

// Attach Authorization header from localStorage token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
