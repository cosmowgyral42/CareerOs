import {
  fireEvent,
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

import Register from '../Register.jsx';

const navigateMock = vi.fn();
const registerUserMock = vi.fn();
const removeTokenMock = vi.fn();

vi.mock(
  '../../../services/api',
  () => ({
    registerUser: (...args) =>
      registerUserMock(...args),
  }),
);

vi.mock(
  '../../../services/api/authStorage',
  () => ({
    removeToken: () => removeTokenMock(),
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

function renderRegister() {
  return render(
    <MemoryRouter
      initialEntries={['/register']}
    >
      <Routes>
        <Route
          path="/register"
          element={<Register />}
        />

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

function submitForm() {
  const form =
    screen
      .getByRole('button', {
        name: 'Create account',
      })
      .closest('form');

  fireEvent.submit(form);
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'shows validation error when full name is empty',
    () => {
      renderRegister();

      submitForm();

      expect(
        screen.getByText(
          'Please enter your full name.',
        ),
      ).toBeInTheDocument();

      expect(
        registerUserMock,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'shows validation error when email is empty',
    async () => {
      const user = userEvent.setup();

      renderRegister();

      await user.type(
        screen.getByLabelText(
          'Full name',
        ),
        'Test User',
      );

      submitForm();

      expect(
        screen.getByText(
          'Please enter your email.',
        ),
      ).toBeInTheDocument();

      expect(
        registerUserMock,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'shows validation error for a short password',
    async () => {
      const user = userEvent.setup();

      renderRegister();

      await user.type(
        screen.getByLabelText(
          'Full name',
        ),
        'Test User',
      );

      await user.type(
        screen.getByLabelText(
          'Email',
        ),
        'test@example.com',
      );

      await user.type(
        screen.getByLabelText(
          'Password',
        ),
        'short',
      );

      submitForm();

      expect(
        screen.getByText(
          'Password must contain at least 8 characters.',
        ),
      ).toBeInTheDocument();

      expect(
        registerUserMock,
      ).not.toHaveBeenCalled();
    },
  );

  it(
    'registers successfully and navigates to login',
    async () => {
      const user = userEvent.setup();

      registerUserMock.mockResolvedValue(
        undefined,
      );

      renderRegister();

      await user.type(
        screen.getByLabelText(
          'Full name',
        ),
        'Test User',
      );

      await user.type(
        screen.getByLabelText(
          'Email',
        ),
        'test@example.com',
      );

      await user.type(
        screen.getByLabelText(
          'Password',
        ),
        'password123',
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Create account',
          },
        ),
      );

      await waitFor(() => {
        expect(
          registerUserMock,
        ).toHaveBeenCalled();
      });

      expect(
        registerUserMock,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          full_name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          timezone: expect.any(String),
        }),
      );

      expect(
        removeTokenMock,
      ).toHaveBeenCalled();

      expect(
        navigateMock,
      ).toHaveBeenCalledWith(
        '/login',
        {
          replace: true,
          state: {
            registered: true,
            email: 'test@example.com',
          },
        },
      );
    },
  );

  it(
    'shows API error when registration fails',
    async () => {
      const user = userEvent.setup();

      registerUserMock.mockRejectedValue(
        new Error(
          'Email already registered.',
        ),
      );

      renderRegister();

      await user.type(
        screen.getByLabelText(
          'Full name',
        ),
        'Test User',
      );

      await user.type(
        screen.getByLabelText(
          'Email',
        ),
        'test@example.com',
      );

      await user.type(
        screen.getByLabelText(
          'Password',
        ),
        'password123',
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Create account',
          },
        ),
      );

      expect(
        await screen.findByText(
          'Email already registered.',
        ),
      ).toBeInTheDocument();

      expect(
        removeTokenMock,
      ).not.toHaveBeenCalled();
    },
  );
});