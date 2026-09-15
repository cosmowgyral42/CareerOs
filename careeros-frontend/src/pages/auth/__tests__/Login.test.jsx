import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

import Login from '../Login.jsx';

const navigateMock = vi.fn();
const loginUserMock = vi.fn();
const getCurrentUserMock = vi.fn();
const setUserMock = vi.fn();

vi.mock(
  '../../../services/api',
  () => ({
    loginUser: (...args) =>
      loginUserMock(...args),

    getCurrentUser: () =>
      getCurrentUserMock(),
  }),
);

vi.mock(
  '../../../context/useAuth',
  () => ({
    useAuth: () => ({
      setUser: setUserMock,
      isLoading: false,
    }),
  }),
);

vi.mock(
  'react-router-dom',
  async () => {
    const actual = await vi.importActual(
      'react-router-dom',
    );

    return {
      ...actual,
      useNavigate: () => navigateMock,
    };
  },
);

function renderLogin(
  initialEntry = '/login',
) {
  return render(
    <MemoryRouter
      initialEntries={[initialEntry]}
    >
      <Routes>
        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'shows validation error when email is empty',
    async () => {
      const user = userEvent.setup();

      renderLogin();

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Sign in',
          },
        ),
      );

      expect(
        screen.getByText(
          'Please enter your email.',
        ),
      ).toBeInTheDocument();

      expect(
        loginUserMock,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'shows validation error when password is empty',
    async () => {
      const user = userEvent.setup();

      renderLogin();

      await user.type(
        screen.getByLabelText('Email'),
        'test@example.com',
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Sign in',
          },
        ),
      );

      expect(
        screen.getByText(
          'Please enter your password.',
        ),
      ).toBeInTheDocument();

      expect(
        loginUserMock,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'logs in successfully and navigates to dashboard',
    async () => {
      const user = userEvent.setup();

      const currentUser = {
        id: 1,
        full_name: 'Test User',
        email: 'test@example.com',
      };

      loginUserMock.mockResolvedValue(
        undefined,
      );

      getCurrentUserMock.mockResolvedValue(
        currentUser,
      );

      renderLogin();

      await user.type(
        screen.getByLabelText('Email'),
        'test@example.com',
      );

      await user.type(
        screen.getByLabelText('Password'),
        'password123',
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Sign in',
          },
        ),
      );

      await waitFor(() => {
        expect(
          loginUserMock,
        ).toHaveBeenCalledWith(
          'test@example.com',
          'password123',
        );
      });

      await waitFor(() => {
        expect(
          getCurrentUserMock,
        ).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(
          setUserMock,
        ).toHaveBeenCalledWith(
          currentUser,
        );
      });

      await waitFor(() => {
        expect(
          navigateMock,
        ).toHaveBeenCalledWith(
          '/dashboard',
          {
            replace: true,
          },
        );
      });
    },
  );

  it(
    'shows API error when login fails',
    async () => {
      const user = userEvent.setup();

      loginUserMock.mockRejectedValue(
        new Error(
          'Invalid email or password.',
        ),
      );

      renderLogin();

      await user.type(
        screen.getByLabelText('Email'),
        'test@example.com',
      );

      await user.type(
        screen.getByLabelText('Password'),
        'wrongpassword',
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Sign in',
          },
        ),
      );

      expect(
        await screen.findByText(
          'Invalid email or password.',
        ),
      ).toBeInTheDocument();

      expect(
        getCurrentUserMock,
      ).not.toHaveBeenCalled();
    },
  );
});