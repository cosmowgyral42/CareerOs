import apiClient from './apiClient';

export function registerUser(payload) {
  return apiClient('/api/v1/auth/register', {
    method: 'POST',
    body: payload,
  });
}

export function loginUser(email, password) {
  const formData = new URLSearchParams();

  formData.append('username', email);
  formData.append('password', password);

  return apiClient('/api/v1/auth/login', {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
}

export function getCurrentUser() {
  return apiClient('/api/v1/users/me');
}