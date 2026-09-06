import apiClient, {
  getErrorMessage,
} from './apiClient';

import { setToken } from './authStorage';

const API_BASE_URL = 'http://127.0.0.1:8000';

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

  formData.set(
    'username',
    email.trim(),
  );

  formData.set(
    'password',
    password,
  );

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: formData.toString(),
      },
    );
  } catch {
    throw new Error(
      'Unable to connect to the CareerOS server.',
    );
  }

  const contentType =
    response.headers.get('content-type') || '';

  let data = null;

  if (
    contentType.includes(
      'application/json',
    )
  ) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
        response.status === 401
          ? 'Invalid email or password.'
          : `Login failed with status ${response.status}.`,
      ),
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
  return apiClient.get(
    '/api/v1/users/me',
  );
}