import apiRequest from './apiClient';
import { setToken } from './authStorage';

export async function registerUser(userData) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export async function loginUser(email, password) {
  const body = new URLSearchParams();

  body.append('username', email);
  body.append('password', password);

  const response = await fetch(
    'http://127.0.0.1:8000/api/v1/auth/login',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
  );

  if (!response.ok) {
    let message = `Login failed with status ${response.status}.`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  const data = await response.json();

  setToken(data.access_token);

  return data;
}

export async function getCurrentUser() {
  return apiRequest('/users/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('careeros_access_token')}`,
    },
  });
}