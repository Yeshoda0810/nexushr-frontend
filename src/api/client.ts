import axios from 'axios';

const API_BASE_URL = 'https://nexushr-backend-lyae.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT token (if present) to every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('nexushr_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;