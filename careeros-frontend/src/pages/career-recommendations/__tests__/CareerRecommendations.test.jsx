import {
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

import CareerRecommendations from '../CareerRecommendations.jsx';

const analyzeCareerFitMock = vi.fn();
const createProjectMock = vi.fn();
const createProjectFromSkillGapMock = vi.fn();
const createTaskMock = vi.fn();
const createTaskFromSkillGapMock = vi.fn();
const getCareerTargetsMock = vi.fn();

vi.mock(
  '../../../services/api',
  () => ({
    analyzeCareerFit: (data) =>
      analyzeCareerFitMock(data),

    createProject: (data) =>
      createProjectMock(data),

    createProjectFromSkillGap: (
      skillGapId,
      data,
    ) =>
      createProjectFromSkillGapMock(
        skillGapId,
        data,
      ),

    createTask: (data) =>
      createTaskMock(data),

    createTaskFromSkillGap: (
      skillGapId,
      data,
    ) =>
      createTaskFromSkillGapMock(
        skillGapId,
        data,
      ),

    getCareerTargets: () =>
      getCareerTargetsMock(),
  }),
);

const careerTargets = [
  {
    id: 1,
    title: 'Backend Engineer',
    target_role: 'Backend Engineer',
    target_level: 'Junior',
  },
];

const careerFitResult = {
  id: 101,
  career_target_id: 1,
  job_description:
    'A backend engineering role requiring Python, FastAPI, PostgreSQL, Docker, REST APIs, testing, and deployment experience.',
  company_name: 'Test Company',
  job_title: 'Junior Backend Engineer',
  match_score: 75,
  matched_skills: [
    'Python',
    'FastAPI',
  ],
  skill_gaps: [
    {
      skill_gap_id: 42,
      skill: 'Docker',
      importance: 'high',
      reason:
        'Docker is required for containerized backend deployment.',
    },
  ],
  strengths: [
    'Strong Python experience.',
  ],
  career_insight:
    'You have a strong backend foundation but should improve Docker skills.',
  roadmap: [
    {
      title: 'Containerization Fundamentals',
      objective:
        'Build practical Docker experience.',
      skills: ['Docker'],
      recommended_projects: [
        'Dockerized FastAPI Application',
      ],
      recommended_tasks: [
        'Containerize a FastAPI application',
      ],
    },
  ],
  next_action:
    'Start learning Docker fundamentals.',
};

describe('CareerRecommendations', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getCareerTargetsMock.mockResolvedValue(
      careerTargets,
    );

    createTaskFromSkillGapMock.mockResolvedValue({
      id: 500,
      title:
        'Containerize a FastAPI application',
      status: 'pending',
    });

    createTaskMock.mockResolvedValue({
      id: 501,
      title:
        'Containerize a FastAPI application',
      status: 'pending',
    });

    createProjectFromSkillGapMock.mockResolvedValue({
      id: 600,
      title:
        'Dockerized FastAPI Application',
      status: 'planning',
    });

    createProjectMock.mockResolvedValue({
      id: 601,
      title:
        'Dockerized FastAPI Application',
      status: 'planning',
    });
  });

  it(
    'creates a roadmap task through the matching skill gap',
    async () => {
      const user = userEvent.setup();

      analyzeCareerFitMock.mockResolvedValue(
        careerFitResult,
      );

      render(
        <CareerRecommendations />,
      );

      await screen.findByRole(
        'combobox',
        {
          name: 'Career Target',
        },
      );

      const jobDescription =
        screen.getByLabelText(
          'Job Description',
        );

      await user.type(
        jobDescription,
        careerFitResult.job_description,
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Generate AI Career Insights',
          },
        ),
      );

      await screen.findByText(
        /Containerize a FastAPI application/,
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Create Task',
          },
        ),
      );

      await waitFor(() => {
        expect(
          createTaskFromSkillGapMock,
        ).toHaveBeenCalledWith(
          42,
          {
            title:
              'Containerize a FastAPI application',
            description:
              'Docker is required for containerized backend deployment.',
            priority: 'high',
          },
        );
      });

      expect(
        createTaskMock,
      ).not.toHaveBeenCalled();

      expect(
        await screen.findByText(
          '✓ Task created',
        ),
      ).toBeInTheDocument();
    },
  );

  it(
    'creates a roadmap project through the matching skill gap',
    async () => {
      const user = userEvent.setup();

      analyzeCareerFitMock.mockResolvedValue(
        careerFitResult,
      );

      render(
        <CareerRecommendations />,
      );

      await screen.findByRole(
        'combobox',
        {
          name: 'Career Target',
        },
      );

      const jobDescription =
        screen.getByLabelText(
          'Job Description',
        );

      await user.type(
        jobDescription,
        careerFitResult.job_description,
      );

      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'Generate AI Career Insights',
          },
        ),
      );

      await screen.findByText(
        /Dockerized FastAPI Application/,
      );

      const projectButton =
        await screen.findByRole(
          'button',
          {
            name: 'Create Project',
          },
        );

      await user.click(projectButton);

      await waitFor(() => {
        expect(
          createProjectFromSkillGapMock,
        ).toHaveBeenCalledWith(
          42,
          {
            title:
              'Dockerized FastAPI Application',
            description:
              'Recommended project from your AI career roadmap.',
          },
        );
      });

      expect(
        createProjectMock,
      ).not.toHaveBeenCalled();

      expect(
        await screen.findByText(
          '✓ Project created',
        ),
      ).toBeInTheDocument();
    },
  );
});