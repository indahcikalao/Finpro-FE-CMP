import axios from 'axios';
import { STORAGE_PREFIX } from '../hooks';

const baseURL = process.env.REACT_APP_BASE_URL

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": 'application/json',
  }
})

export const publicApi = axios.create({
  baseURL,
  headers: {
    "Content-Type": 'application/json',
  }
})

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'token'));
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default api