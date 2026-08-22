import { getToken } from './authStorage';

const API_BASE_URL = 'http://127.0.0.1:8000';

async function request(path, options = {}) {
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  const isFormData = options.body instanceof FormData;
  const isUrlEncoded = options.body instanceof URLSearchParams;

  if (!isFormData && !isUrlEncoded) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = 'Something went wrong.';

    try {
      const data = await response.json();

      if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (Array.isArray(data.detail)) {
        message = data.detail
          .map((item) => item.msg)
          .join(', ');
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

const apiClient = {
  get(path) {
    return request(path, {
      method: 'GET',
    });
  },

  post(path, body) {
    let requestBody = body;

    if (
      !(body instanceof FormData) &&
      !(body instanceof URLSearchParams)
    ) {
      requestBody = JSON.stringify(body);
    }

    return request(path, {
      method: 'POST',
      body: requestBody,
    });
  },

  put(path, body) {
    return request(path, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch(path, body) {
    return request(path, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete(path) {
    return request(path, {
      method: 'DELETE',
    });
  },
};

export default apiClient;