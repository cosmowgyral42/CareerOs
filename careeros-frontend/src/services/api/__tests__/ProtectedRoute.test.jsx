import {
  render,
  screen,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import ProtectedRoute from '../../../routes/ProtectedRoute.jsx';

const useAuthMock = vi.fn();

vi.mock('../../../context/useAuth.js', () => ({
  useAuth: () => useAuthMock(),
}));

function renderProtectedRoute() {
  return render(
    <MemoryRouter
      initialEntries={['/dashboard']}
    >
      <Routes>
        <Route
          element={<ProtectedRoute />}
        >
          <Route
            path="/dashboard"
            element={
              <div>
                Protected dashboard
              </div>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <div>
              Login page
            </div>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it(
    'shows a loading state while authentication is loading',
    () => {
      useAuthMock.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
      });

      renderProtectedRoute();

      expect(
        screen.getByText(
          'Loading CareerOS...',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'redirects unauthenticated users to login',
    () => {
      useAuthMock.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
      });

      renderProtectedRoute();

      expect(
        screen.getByText(
          'Login page',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'renders protected content for authenticated users',
    () => {
      useAuthMock.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
      });

      renderProtectedRoute();

      expect(
        screen.getByText(
          'Protected dashboard',
        ),
      ).toBeInTheDocument();
    },
  );
});