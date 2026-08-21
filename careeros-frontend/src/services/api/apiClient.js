const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');

async function apiClient(path, options = {}) {
  const {
    method = 'GET',
    body,
    headers = {},
    ...rest
  } = options;

  const token = localStorage.getItem('careos_token');

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  const isFormData = body instanceof FormData;
  const isUrlEncoded = body instanceof URLSearchParams;

  if (body !== undefined && !isFormData && !isUrlEncoded) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body:
      isFormData || isUrlEncoded
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
    ...rest,
  });

  let data = null;

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    data = await response.json();
  } else if (response.status !== 204) {
    data = await response.text();
  }

  if (response.status === 401) {
    localStorage.removeItem('careos_token');
  }

  if (!response.ok) {
    const error = new Error(
      data?.detail || data?.message || 'Something went wrong.',
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export default apiClient;