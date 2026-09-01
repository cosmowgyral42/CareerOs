import apiClient from './apiClient';
import { setToken } from './authStorage';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';

export async function registerUser(userData) {
  return apiClient.post(
    '/api/v1/auth/register',
    userData,
  );
}

export async function loginUser(
  email,
  password,
) {
  const formData = new URLSearchParams();

  formData.set('username', email);
  formData.set('password', password);

  const response = await fetch(
    `${API_BASE_URL}/api/v1/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.detail ||
        `Login failed with status ${response.status}.`,
    );
  }

  if (!data?.access_token) {
    throw new Error(
      'Login succeeded but no access token was returned.',
    );
  }

  setToken(data.access_token);

  return data;
}

export async function getCurrentUser() {
  return apiClient.get('/api/v1/users/me');
}
