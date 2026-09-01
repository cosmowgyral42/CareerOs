import {
  getToken,
  removeToken,
} from './authStorage';


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';


async function request(
  endpoint,
  options = {},
) {
  const token = getToken();

  const headers = new Headers(
    options.headers || {},
  );


  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set(
      'Content-Type',
      'application/json',
    );
  }


  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`,
    );
  }


  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    },
  );


  const contentType =
    response.headers.get(
      'content-type',
    ) || '';


  const data =
    contentType.includes(
      'application/json',
    )
      ? await response.json()
      : null;


  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
    }

    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}.`;

    throw new Error(message);
  }


  return data;
}


const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: 'GET',
    });
  },


  post(
    endpoint,
    body,
    options = {},
  ) {
    return request(endpoint, {
      ...options,
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : JSON.stringify(body),
    });
  },


  patch(
    endpoint,
    body,
    options = {},
  ) {
    return request(endpoint, {
      ...options,
      method: 'PATCH',
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
  },


  delete(
    endpoint,
    options = {},
  ) {
    return request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  },
};


export default apiClient;
