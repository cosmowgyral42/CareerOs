import {
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import AppLayout from '../../../layouts/AppLayout.jsx';

vi.mock('../../../context/useAuth.js', () => ({
  useAuth: () => ({
    logout: vi.fn(),
    user: {
      full_name: 'Test User',
    },
  }),
}));

function renderAppLayout() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <div>
                Dashboard test content
              </div>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe('AppLayout', () => {
  it(
    'renders the topbar, sidebar, and nested page content',
    () => {
      renderAppLayout();

      expect(
        screen.getByText(
          'Dashboard test content',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Your career workspace',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /Career\s*OS/i,
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'opens the mobile sidebar',
    () => {
      renderAppLayout();

      const menuButton =
        screen.getByRole(
          'button',
          {
            name:
              'Open navigation menu',
          },
        );

      fireEvent.click(menuButton);

      expect(
        screen.getAllByRole(
          'button',
          {
            name:
              'Close navigation menu',
          },
        ).length,
      ).toBeGreaterThan(0);
    },
  );
});