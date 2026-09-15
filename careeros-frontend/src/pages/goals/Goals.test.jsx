import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import Goals from './Goals.jsx';

import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from '../../services/api';


vi.mock('../../services/api', () => ({
  createGoal: vi.fn(),
  deleteGoal: vi.fn(),
  getGoals: vi.fn(),
  updateGoal: vi.fn(),
}));


vi.mock(
  '../../components/common/ConfirmDialog',
  () => ({
    default: ({
      isOpen,
      title,
      message,
      onConfirm,
      onCancel,
    }) => {
      if (!isOpen) {
        return null;
      }

      return (
        <div>
          <h2>{title}</h2>

          <p>{message}</p>

          <button
            type="button"
            onClick={onConfirm}
          >
            Confirm delete
          </button>

          <button
            type="button"
            onClick={onCancel}
          >
            Cancel delete
          </button>
        </div>
      );
    },
  }),
);


vi.mock(
  '../../components/common/EmptyState',
  () => ({
    default: ({
      title,
      message,
    }) => (
      <div>
        <h2>{title}</h2>

        <p>{message}</p>
      </div>
    ),
  }),
);


vi.mock(
  '../../components/common/ErrorState',
  () => ({
    default: ({
      title,
      message,
      onRetry,
    }) => (
      <div>
        <h2>{title}</h2>

        <p>{message}</p>

        <button
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      </div>
    ),
  }),
);


vi.mock(
  '../../components/common/LoadingState',
  () => ({
    default: ({ message }) => (
      <p>{message}</p>
    ),
  }),
);


vi.mock(
  '../../components/ui/Toast',
  () => ({
    default: ({
      message,
      type,
      onClose,
    }) => (
      <div>
        <p>
          {type}: {message}
        </p>

        <button
          type="button"
          onClick={onClose}
        >
          Close toast
        </button>
      </div>
    ),
  }),
);


const sampleGoal = {
  id: 1,
  title: 'Become a backend engineer',
  description:
    'Build production-quality APIs.',
  status: 'active',
  target_date: '2026-12-31',
};


function renderGoals() {
  return render(<Goals />);
}


describe('Goals', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });


  afterEach(() => {
    vi.unstubAllGlobals();
  });


  it(
    'shows loading state while goals are loading',
    async () => {
      getGoals.mockReturnValue(
        new Promise(() => {}),
      );

      renderGoals();

      expect(
        screen.getByText(
          'Loading your goals...',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'renders goals successfully',
    async () => {
      getGoals.mockResolvedValue([
        sampleGoal,
      ]);

      renderGoals();

      expect(
        await screen.findByText(
          'Become a backend engineer',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Build production-quality APIs.',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Total goals',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Active',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'shows empty state when there are no goals',
    async () => {
      getGoals.mockResolvedValue([]);

      renderGoals();

      expect(
        await screen.findByText(
          'No goals yet',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'shows error state when loading goals fails',
    async () => {
      getGoals.mockRejectedValue(
        new Error(
          'Unable to load goals from server',
        ),
      );

      renderGoals();

      expect(
        await screen.findByText(
          'Unable to complete action',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Unable to load goals from server',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'creates a new goal successfully',
    async () => {
      getGoals.mockResolvedValue([]);

      createGoal.mockResolvedValue({
        id: 2,
        title: 'Learn React',
        description:
          'Build modern frontend applications.',
        status: 'active',
        target_date: '2026-10-01',
      });

      renderGoals();

      await screen.findByText(
        'No goals yet',
      );

      fireEvent.change(
        screen.getByLabelText('Title'),
        {
          target: {
            value: 'Learn React',
          },
        },
      );

      fireEvent.change(
        screen.getByLabelText(
          'Description',
        ),
        {
          target: {
            value:
              'Build modern frontend applications.',
          },
        },
      );

      fireEvent.change(
        screen.getByLabelText(
          'Target date',
        ),
        {
          target: {
            value: '2026-10-01',
          },
        },
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Create goal',
        }),
      );

      await waitFor(() => {
        expect(
          createGoal,
        ).toHaveBeenCalledWith({
          title: 'Learn React',
          description:
            'Build modern frontend applications.',
          target_date: '2026-10-01',
        });
      });

      expect(
        await screen.findByText(
          'Learn React',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'edits a goal successfully',
    async () => {
      getGoals.mockResolvedValue([
        sampleGoal,
      ]);

      updateGoal.mockResolvedValue({
        ...sampleGoal,
        title: 'Senior backend engineer',
      });

      renderGoals();

      await screen.findByText(
        'Become a backend engineer',
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Edit',
        }),
      );

      expect(
        screen.getByDisplayValue(
          'Become a backend engineer',
        ),
      ).toBeInTheDocument();

      fireEvent.change(
        screen.getByLabelText('Title'),
        {
          target: {
            value:
              'Senior backend engineer',
          },
        },
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Save changes',
        }),
      );

      await waitFor(() => {
        expect(
          updateGoal,
        ).toHaveBeenCalledWith(
          sampleGoal.id,
          {
            title:
              'Senior backend engineer',
            description:
              'Build production-quality APIs.',
            target_date:
              '2026-12-31',
          },
        );
      });

      expect(
        await screen.findByText(
          'Senior backend engineer',
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'marks a goal as completed',
    async () => {
      getGoals.mockResolvedValue([
        sampleGoal,
      ]);

      updateGoal.mockResolvedValue({
        ...sampleGoal,
        status: 'completed',
      });

      renderGoals();

      await screen.findByText(
        'Become a backend engineer',
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Complete',
        }),
      );

      await waitFor(() => {
        expect(
          updateGoal,
        ).toHaveBeenCalledWith(
          sampleGoal.id,
          {
            status: 'completed',
          },
        );
      });

      expect(
        await screen.findByText(
          'Completed',
          {
            selector: 'span',
          },
        ),
      ).toBeInTheDocument();
    },
  );


  it(
    'deletes a goal successfully',
    async () => {
      getGoals.mockResolvedValue([
        sampleGoal,
      ]);

      deleteGoal.mockResolvedValue();

      renderGoals();

      await screen.findByText(
        'Become a backend engineer',
      );

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Delete',
        }),
      );

      expect(
        screen.getByText(
          'Delete goal?',
        ),
      ).toBeInTheDocument();

      fireEvent.click(
        screen.getByRole('button', {
          name: 'Confirm delete',
        }),
      );

      await waitFor(() => {
        expect(
          deleteGoal,
        ).toHaveBeenCalledWith(
          sampleGoal.id,
        );
      });

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Become a backend engineer',
          ),
        ).not.toBeInTheDocument();
      });
    },
  );
});