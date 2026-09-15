import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import apiClient from '../apiClient';

describe('apiClient', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends GET requests successfully', async () => {
    const mockData = {
      id: 1,
      name: 'CareerOS',
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => mockData,
    });

    vi.stubGlobal('fetch', fetchMock);

    const result = await apiClient.get(
      '/api/v1/test',
    );

    expect(result).toEqual(mockData);

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/api/v1/test',
      expect.objectContaining({
        method: 'GET',
      }),
    );
  });

  it('adds authorization header when token exists', async () => {
    localStorage.setItem(
      'careeros_access_token',
      'test-token',
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        success: true,
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await apiClient.get(
      '/api/v1/protected',
    );

    const requestOptions =
      fetchMock.mock.calls[0][1];

    expect(
      requestOptions.headers.get(
        'Authorization',
      ),
    ).toBe('Bearer test-token');
  });

  it('throws backend error messages', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        detail: 'Invalid request',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      apiClient.get('/api/v1/test'),
    ).rejects.toThrow(
      'Invalid request',
    );
  });

  it('removes token after a 401 response', async () => {
    localStorage.setItem(
      'careeros_access_token',
      'expired-token',
    );

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        detail: 'Unauthorized',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      apiClient.get('/api/v1/protected'),
    ).rejects.toThrow(
      'Unauthorized',
    );

    expect(
      localStorage.getItem(
        'careeros_access_token',
      ),
    ).toBeNull();
  });
});