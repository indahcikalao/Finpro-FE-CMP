import axios from 'axios';
import { STORAGE_PREFIX } from '../config';
import Swal from 'sweetalert2';
import { Encryption } from '../utils/lib';

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
    const token = localStorage.getItem(STORAGE_PREFIX + 'token');
    const decryptedToken = Encryption.decrypt(token);

    if (decryptedToken) {
      config.headers['Authorization'] = `Bearer ${decryptedToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();

      await Swal.fire({
        icon: "error",
        title: "Session ended",
        text: "Please login back!",
        timer: 1500,
        showConfirmButton: false,
      });

      window.location.reload();
    }
  }
)

export default api