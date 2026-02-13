// src/services/auth.ts
import api, { setAuthToken } from './api';

export const authService = {
  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  verifyOTP: async (userId: string, otp: string) => {
    const response = await api.post('/otp/verify', { userId, otp });
    await setAuthToken(response.data.data.token);
    return response.data;
  },

  submitForm: async (formData: any) => {
    const response = await api.post('/form/submit', formData);
    return response.data;
  },

  getSubmissions: async () => {
    const response = await api.get('/form/submissions');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  }
};