import apiClient from './apiClient';
import { setToken } from './authStorage';

export async function registerUser(userData) {
  return apiClient.post('/api/v1/auth/register', userData);
}

export async function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append('username', email);
  formData.append('password', password);

  const response = await apiClient.post(
    '/api/v1/auth/login',
    formData,
  );

  setToken(response.access_token);

  return response;
}

export async function getCurrentUser() {
  return apiClient.get('/api/v1/users/me');
}