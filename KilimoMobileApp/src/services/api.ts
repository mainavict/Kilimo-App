// src/services/api.ts
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://kilimo-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('token');
      // Will redirect to login in navigation
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('token', token);
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync('token');
};

export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('token');
};

export default api;