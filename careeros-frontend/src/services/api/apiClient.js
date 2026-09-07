import {
  getToken,
  removeToken,
} from './authStorage';


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://127.0.0.1:8000';


function getNonEmptyString(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : null;
}


export function getErrorMessage(
  data,
  fallbackMessage,
) {
  const errorMessage = getNonEmptyString(
    data?.error?.message,
  );

  if (errorMessage) {
    return errorMessage;
  }

  const detailMessage = getNonEmptyString(
    data?.detail,
  );

  if (detailMessage) {
    return detailMessage;
  }

  if (Array.isArray(data?.detail)) {
    const validationMessages = data.detail
      .map((item) => {
        if (typeof item === 'object' && item !== null) {
          return (
            getNonEmptyString(item.msg) ||
            getNonEmptyString(item.message)
          );
        }

        return getNonEmptyString(item);
      })
      .filter(Boolean);

    if (validationMessages.length) {
      return validationMessages.join('; ');
    }
  }

  const message = getNonEmptyString(data?.message);

  return message || fallbackMessage;
}


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

  let response;

  try {
    response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      },
    );
  } catch {
    throw new Error(
      'Unable to connect to the CareerOS server.',
    );
  }

  if (
    response.status === 204 ||
    response.headers.get('content-length') === '0'
  ) {
    if (!response.ok) {
      throw new Error(
        getErrorMessage(
          null,
          `Request failed with status ${response.status}.`,
        ),
      );
    }

    return null;
  }

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

    const error = new Error(
      getErrorMessage(
        data,
        `Request failed with status ${response.status}.`,
      ),
    );

    error.status = response.status;

    throw error;
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
