import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import SkillGaps from '../SkillGaps.jsx';

const getSkillGapsMock = vi.fn();
const updateSkillGapMock = vi.fn();
const deleteSkillGapMock = vi.fn();

vi.mock(
  '../../../services/api',
  () => ({
    getSkillGaps: () =>
      getSkillGapsMock(),

    updateSkillGap: (
      skillGapId,
      skillGapData,
    ) =>
      updateSkillGapMock(
        skillGapId,
        skillGapData,
      ),

    deleteSkillGap: (skillGapId) =>
      deleteSkillGapMock(skillGapId),
  }),
);

const skillGaps = [
  {
    id: 1,
    skill_id: 101,
    status: 'missing',
    importance: 'high',
    notes: 'Learn React fundamentals.',
  },
  {
    id: 2,
    skill_id: 102,
    status: 'learning',
    importance: 'medium',
    notes: null,
  },
];

describe('SkillGaps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it(
    'shows loading state while skill gaps are loading',
    () => {
      getSkillGapsMock.mockReturnValue(
        new Promise(() => {}),
      );

      render(<SkillGaps />);

      expect(
        screen.getByText(
          'Loading skill gaps...',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'loads and displays skill gaps',
    async () => {
      getSkillGapsMock.mockResolvedValue(
        skillGaps,
      );

      render(<SkillGaps />);

      expect(
        await screen.findByText(
          'Skill #101',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Skill #102',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Learn React fundamentals.',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'shows empty state when there are no skill gaps',
    async () => {
      getSkillGapsMock.mockResolvedValue([]);

      render(<SkillGaps />);

      expect(
        await screen.findByText(
          'No skill gaps yet',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'updates a skill gap status',
    async () => {
      const user = userEvent.setup();

      getSkillGapsMock.mockResolvedValue(
        skillGaps,
      );

      updateSkillGapMock.mockResolvedValue({
        ...skillGaps[0],
        status: 'learning',
      });

      render(<SkillGaps />);

      await screen.findByText(
        'Skill #101',
      );

      const statusSelect =
        screen.getAllByLabelText(
          'Status',
        )[0];
      await user.selectOptions(
        statusSelect,
        'learning',
      );

      await waitFor(() => {
        expect(
          updateSkillGapMock,
        ).toHaveBeenCalledWith(
          1,
          {
            status: 'learning',
          },
        );
      });

      expect(
        await screen.findByText(
          'Skill gap updated.',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'opens deletion confirmation dialog',
    async () => {
      const user = userEvent.setup();

      getSkillGapsMock.mockResolvedValue(
        skillGaps,
      );

      render(<SkillGaps />);

      await screen.findByText(
        'Skill #101',
      );

      const removeButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Remove gap',
          },
        );

      await user.click(removeButtons[0]);

      expect(
        screen.getByRole(
          'dialog',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Remove skill gap?',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'This skill-gap record will be permanently removed.',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'does not delete when cancellation is selected',
    async () => {
      const user = userEvent.setup();

      getSkillGapsMock.mockResolvedValue(
        skillGaps,
      );

      render(<SkillGaps />);

      await screen.findByText(
        'Skill #101',
      );

      const removeButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Remove gap',
          },
        );

      await user.click(removeButtons[0]);

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Cancel',
          },
        ),
      );

      expect(
        deleteSkillGapMock,
      ).not.toHaveBeenCalled();

      expect(
        screen.queryByRole(
          'dialog',
        ),
      ).not.toBeInTheDocument();
    },
  );

  it(
    'deletes a skill gap after confirmation',
    async () => {
      const user = userEvent.setup();

      getSkillGapsMock.mockResolvedValue(
        skillGaps,
      );

      deleteSkillGapMock.mockResolvedValue(
        undefined,
      );

      render(<SkillGaps />);

      await screen.findByText(
        'Skill #101',
      );

      const removeButtons =
        screen.getAllByRole(
          'button',
          {
            name: 'Remove gap',
          },
        );

      await user.click(removeButtons[0]);

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Remove',
          },
        ),
      );

      await waitFor(() => {
        expect(
          deleteSkillGapMock,
        ).toHaveBeenCalledWith(1);
      });

      expect(
        await screen.findByText(
          'Skill gap removed.',
        ),
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(
          screen.queryByText(
            'Skill #101',
          ),
        ).not.toBeInTheDocument();
      });
    },
  );

  it(
    'shows error state when loading fails',
    async () => {
      getSkillGapsMock.mockRejectedValue(
        new Error(
          'Unable to load skill gaps.',
        ),
      );

      render(<SkillGaps />);

      expect(
        await screen.findByText(
          'Something went wrong',
        ),
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          'Unable to load skill gaps.',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'retries loading skill gaps after an error',
    async () => {
      getSkillGapsMock
        .mockRejectedValueOnce(
          new Error(
            'Unable to load skill gaps.',
          ),
        )
        .mockResolvedValueOnce(
          skillGaps,
        );

      render(<SkillGaps />);

      await screen.findByText(
        'Unable to load skill gaps.',
      );

      const retryButton =
        screen.getByRole(
          'button',
          {
            name: /try again/i,
          },
        );

      fireEvent.click(retryButton);

      expect(
        await screen.findByText(
          'Skill #101',
        ),
      ).toBeInTheDocument();

      expect(
        getSkillGapsMock,
      ).toHaveBeenCalledTimes(2);
    },
  );
});