import {
  beforeEach,
  describe,
  expect,
  it,
} from 'vitest';

import {
  getToken,
  hasToken,
  removeToken,
  setToken,
} from '../authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves a token', () => {
    setToken('test-token');

    expect(getToken()).toBe(
      'test-token',
    );
  });

  it('reports whether a token exists', () => {
    expect(hasToken()).toBe(false);

    setToken('test-token');

    expect(hasToken()).toBe(true);
  });

  it('removes a token', () => {
    setToken('test-token');

    removeToken();

    expect(getToken()).toBeNull();
    expect(hasToken()).toBe(false);
  });
});