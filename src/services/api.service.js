import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const createApiInstance = (baseURL) => {
  const instance = axios.create({ baseURL });
  
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export const api = createApiInstance(API_CONFIG.BASE_URL);