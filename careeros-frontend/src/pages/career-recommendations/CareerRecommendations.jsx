import { useEffect, useRef, useState } from 'react';

import {
  analyzeCareerFit,
  createProject,
  createProjectFromSkillGap,
  createTask,
  createTaskFromSkillGap,
  getCareerTargets,
  getCareerFitHistory,
} from '../../services/api';

function CareerRecommendations() {
  const [careerTargets, setCareerTargets] = useState([]);
  const [careerTargetId, setCareerTargetId] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [result, setResult] = useState(null);
  const [selectedHistoryId, setSelectedHistoryId] =
    useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const resultViewerRef = useRef(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [loadingTargets, setLoadingTargets] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [creatingTaskFor, setCreatingTaskFor] =
    useState(null);
  const [creatingProjectFor, setCreatingProjectFor] =
    useState(null);

  const [createdTasks, setCreatedTasks] = useState(new Set());
  const [createdProjects, setCreatedProjects] =
    useState(new Set());

  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCareerTargets() {
      try {
        setLoadingTargets(true);
        setError('');

        const targets = await getCareerTargets();

        if (!isMounted) {
          return;
        }

        const normalizedTargets = Array.isArray(targets)
          ? targets
          : [];

        setCareerTargets(normalizedTargets);

        if (normalizedTargets.length > 0) {
          setCareerTargetId(
            String(normalizedTargets[0].id),
          );
        }
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setCareerTargets([]);

        setError(
          err.message ||
            'Could not load career targets.',
        );
      } finally {
        if (isMounted) {
          setLoadingTargets(false);
        }
      }
    }

    async function loadAnalysisHistory() {
      try {
        setLoadingHistory(true);

        const history = await getCareerFitHistory();

        if (!isMounted) {
          return;
        }

        setAnalysisHistory(
          Array.isArray(history) ? history : [],
        );
      } catch {
        if (!isMounted) {
          return;
        }

        setAnalysisHistory([]);
      } finally {
        if (isMounted) {
          setLoadingHistory(false);
        }
      }
    }

    loadCareerTargets();
    loadAnalysisHistory();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setResult(null);
    setSelectedHistoryId(null);
    setCreatedTasks(new Set());
    setCreatedProjects(new Set());

    if (!careerTargetId) {
      setError(
        'Please create and select a career target first.',
      );
      return;
    }

    if (jobDescription.trim().length < 100) {
      setError(
        'Job description must contain at least 100 characters.',
      );
      return;
    }

    try {
      setAnalyzing(true);

      const response = await analyzeCareerFit({
        career_target_id: Number(careerTargetId),
        job_description: jobDescription.trim(),
      });

      setResult(response);
      setSelectedHistoryId(null);
    } catch (err) {
      if (err.status === 429) {
        setError(
          'Daily AI analysis limit reached. Your limit resets at 00:00 UTC. Please try again tomorrow.',
        );
      } else {
        setError(
          err.message ||
            'Career analysis failed. Please try again.',
        );
      }
    } finally {
      setAnalyzing(false);
    }
  }

  function handleViewSkillGap(skillGapId) {
    window.location.href = `/skill-gaps?skillGapId=${skillGapId}`;
  }

  async function handleCreateSkillGapTask(gap) {
    if (!gap.skill_gap_id) {
      setError(
        `Could not create a task for ${gap.skill}: Skill Gap ID is missing.`,
      );
      return;
    }

    const taskKey = `skill-gap-${gap.skill_gap_id}`;

    try {
      setCreatingTaskFor(taskKey);
      setError('');

      await createTaskFromSkillGap(
        gap.skill_gap_id,
        {
          title: `Learn ${gap.skill}`,
          description: gap.reason,
          priority:
            gap.importance?.toLowerCase() === 'high'
              ? 'high'
              : gap.importance?.toLowerCase() === 'low'
                ? 'low'
                : 'medium',
        },
      );

      setCreatedTasks((current) => {
        const next = new Set(current);
        next.add(taskKey);
        return next;
      });
    } catch (err) {
      setError(
        err.message ||
          `Could not create a learning task for ${gap.skill}.`,
      );
    } finally {
      setCreatingTaskFor(null);
    }
  }

  async function handleCreateRoadmapTask(
    taskLabel,
    matchingGap,
  ) {
    const taskKey = `roadmap-task-${taskLabel}`;

    try {
      setCreatingTaskFor(taskKey);
      setError('');

      if (matchingGap?.skill_gap_id) {
        await createTaskFromSkillGap(
          matchingGap.skill_gap_id,
          {
            title: taskLabel,
            description: matchingGap.reason,
            priority:
              matchingGap.importance?.toLowerCase() === 'high'
                ? 'high'
                : matchingGap.importance?.toLowerCase() ===
                    'low'
                  ? 'low'
                  : 'medium',
          },
        );
      } else {
        await createTask({
          title: taskLabel,
          description:
            'Recommended action from your AI career roadmap.',
          priority: 'medium',
        });
      }

      setCreatedTasks((current) => {
        const next = new Set(current);
        next.add(taskKey);
        return next;
      });
    } catch (err) {
      setError(
        err.message ||
          `Could not create task "${taskLabel}".`,
      );
    } finally {
      setCreatingTaskFor(null);
    }
  }

  async function handleCreateProject(
    projectName,
    matchingGap,
  ) {
    const projectKey = `roadmap-project-${projectName}`;

    try {
      setCreatingProjectFor(projectKey);
      setError('');

      if (matchingGap?.skill_gap_id) {
        await createProjectFromSkillGap(
          matchingGap.skill_gap_id,
          {
            title: projectName,
            description:
              'Recommended project from your AI career roadmap.',
          },
        );
      } else {
        await createProject({
          title: projectName,
          description:
            'Recommended project from your AI career roadmap.',
        });
      }

      setCreatedProjects((current) => {
        const next = new Set(current);
        next.add(projectKey);
        return next;
      });
    } catch (err) {
      setError(
        err.message ||
          `Could not create project "${projectName}".`,
      );
    } finally {
      setCreatingProjectFor(null);
    }
  }

  function findSkillGapForRoadmapPhase(phase) {
    if (
      !phase.skills?.length ||
      !result?.skill_gaps?.length
    ) {
      return null;
    }

    return (
      result.skill_gaps.find((gap) =>
        phase.skills.some(
          (skill) =>
            skill.trim().toLowerCase() ===
            gap.skill.trim().toLowerCase(),
        ),
      ) || null
    );
  }

  function handleSelectHistory(analysis) {
    setError('');
    setResult(analysis);
    setSelectedHistoryId(analysis.id);
    setCreatedTasks(new Set());
    setCreatedProjects(new Set());

    requestAnimationFrame(() => {
      resultViewerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  function handleClearSelectedHistory() {
    setResult(null);
    setSelectedHistoryId(null);
    setCreatedTasks(new Set());
    setCreatedProjects(new Set());
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <p className="text-sm font-semibold text-pink-700">
          AI CAREER INTELLIGENCE
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Career Recommendations
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Compare your career target and skills against a
          real job description to discover your strengths,
          skill gaps, roadmap, and next best action.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Analyze a Job Opportunity
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Choose your career target and paste a job
          description.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="career-target"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Career Target
            </label>

            <select
              id="career-target"
              value={careerTargetId}
              onChange={(event) =>
                setCareerTargetId(event.target.value)
              }
              disabled={loadingTargets || analyzing}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {loadingTargets && (
                <option value="">
                  Loading career targets...
                </option>
              )}

              {!loadingTargets &&
                careerTargets.length === 0 && (
                  <option value="">
                    No career targets found
                  </option>
                )}

              {careerTargets.map((target) => (
                <option
                  key={target.id}
                  value={target.id}
                >
                  {target.title}
                  {' — '}
                  {target.target_role}
                  {target.target_level
                    ? ` (${target.target_level})`
                    : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="job-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Job Description
            </label>

            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              disabled={analyzing}
              placeholder="Paste the complete job description here..."
              rows={10}
              className="w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            />

            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>
                Minimum 100 characters required
              </span>

              <span>
                {jobDescription.trim().length} characters
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={
              analyzing ||
              loadingTargets ||
              careerTargets.length === 0
            }
            aria-busy={analyzing}
            className="rounded-xl bg-pink-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden="true"
                />
                Analyzing your career fit...
              </span>
            ) : (
              'Generate AI Career Insights'
            )}
          </button>

          {analyzing && (
            <p
              className="flex items-center gap-2 text-sm text-slate-500"
              role="status"
              aria-live="polite"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-pink-600" />
              AI is analyzing the job description and comparing it with your career profile...
            </p>
          )}
        </form>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-semibold text-slate-900">
            Analysis History
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review your previous AI career-fit analyses.
          </p>
        </div>

        {loadingHistory ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-pink-600"
              aria-hidden="true"
            />
            Loading analysis history...
          </div>
        ) : analysisHistory.length === 0 ? (
          <p className="text-sm text-slate-500">
            No previous career analyses found.
          </p>
        ) : (
          <div className="space-y-3">
            {analysisHistory.map((analysis) => (
              <button
                key={analysis.id}
                type="button"
                onClick={() => handleSelectHistory(analysis)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selectedHistoryId === analysis.id
                    ? 'border-pink-400 bg-pink-50 shadow-sm'
                    : 'border-slate-200 hover:border-pink-300 hover:bg-pink-50/30'
                }`}
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {analysis.job_title ||
                        'Career Analysis'}
                    </h3>

                    <p className="text-sm text-slate-500">
                      {analysis.company_name ||
                        'Company not specified'}
                    </p>

                    {selectedHistoryId === analysis.id && (
                      <span className="mt-2 inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-xs font-bold text-pink-700">
                        Currently viewing
                      </span>
                    )}
                  </div>

                  <div className="rounded-full bg-pink-50 px-3 py-1 text-sm font-semibold text-pink-700">
                    {analysis.match_score}% match
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {result && (
        <div
          ref={resultViewerRef}
          className="scroll-mt-6 space-y-6"
        >
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            {selectedHistoryId && (
              <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-pink-200 bg-pink-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-pink-700">
                    SAVED ANALYSIS
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    You are viewing a previous career-fit analysis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClearSelectedHistory}
                  className="shrink-0 rounded-lg border border-pink-300 bg-white px-3 py-2 text-xs font-bold text-pink-700 transition hover:bg-pink-100"
                >
                  Back to New Analysis
                </button>
              </div>
            )}

            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  CAREER MATCH SCORE
                </p>

                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                  {result.job_title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {result.company_name}
                </p>
              </div>

              <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-pink-100">
                <span className="text-3xl font-bold text-pink-700">
                  {result.match_score}%
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Matched Skills
              </h3>

              {result.matched_skills?.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {result.matched_skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No matched skills were identified.
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Your Strengths
              </h3>

              {result.strengths?.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {result.strengths.map(
                    (strength, index) => (
                      <li
                        key={`${strength}-${index}`}
                        className="flex gap-3 text-sm text-slate-600"
                      >
                        <span className="font-bold text-pink-700">
                          ✓
                        </span>

                        <span>{strength}</span>
                      </li>
                    ),
                  )}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-slate-500">
                  No strengths were identified.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-pink-50 p-6">
            <p className="text-sm font-bold text-pink-700">
              AI CAREER INSIGHT
            </p>

            <p className="mt-3 leading-7 text-slate-700">
              {result.career_insight}
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Priority Skill Gaps
            </h3>

            <div className="mt-5 space-y-4">
              {result.skill_gaps?.length > 0 ? (
                result.skill_gaps.map(
                  (gap, index) => {
                    const taskKey = `skill-gap-${gap.skill_gap_id}`;

                    return (
                      <div
                        key={`${gap.skill}-${index}`}
                        className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <div className="flex items-center gap-3">
                              <h4 className="font-bold text-slate-900">
                                {gap.skill}
                              </h4>

                              <span className="text-xs font-bold uppercase tracking-wide text-pink-700">
                                {gap.importance}
                              </span>
                            </div>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {gap.reason}
                            </p>

                            {gap.skill_gap_id && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewSkillGap(
                                    gap.skill_gap_id,
                                  )
                                }
                                className="mt-3 text-sm font-bold text-pink-700 transition hover:text-pink-800 hover:underline"
                              >
                                View Skill Gap →
                              </button>
                            )}
                          </div>

                          {createdTasks.has(taskKey) ? (
                            <span className="shrink-0 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                              ✓ Learning task created
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                handleCreateSkillGapTask(
                                  gap,
                                )
                              }
                              disabled={
                                !gap.skill_gap_id ||
                                creatingTaskFor === taskKey
                              }
                              className="shrink-0 rounded-lg bg-pink-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {creatingTaskFor === taskKey
                                ? 'Creating...'
                                : 'Create Learning Task'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No major skill gaps were identified.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900">
              Your Career Roadmap
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Turn recommended actions into real tasks and
              projects. When a roadmap phase matches a skill
              gap, the created item will stay linked to that
              skill gap.
            </p>

            <div className="mt-6 space-y-5">
              {result.roadmap?.length > 0 ? (
                result.roadmap.map(
                  (phase, index) => {
                    const matchingGap =
                      findSkillGapForRoadmapPhase(
                        phase,
                      );

                    return (
                      <div
                        key={`${phase.title}-${index}`}
                        className="rounded-2xl border border-slate-200 p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-700">
                            {index + 1}
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-900">
                              {phase.title}
                            </h4>

                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {phase.objective}
                            </p>

                            {matchingGap?.skill_gap_id && (
                              <div className="mt-4 rounded-xl border border-pink-100 bg-pink-50 p-3">
                                <p className="text-xs font-bold uppercase tracking-wide text-pink-700">
                                  Linked Skill Gap
                                </p>

                                <p className="mt-1 text-sm font-semibold text-slate-800">
                                  {matchingGap.skill}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  Tasks and projects created from
                                  this phase will be linked to this
                                  Skill Gap.
                                </p>
                              </div>
                            )}

                            {phase.skills?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                  Skills
                                </p>

                                <div className="mt-2 flex flex-wrap gap-2">
                                  {phase.skills.map(
                                    (skill) => (
                                      <span
                                        key={skill}
                                        className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                                      >
                                        {skill}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}

                            {phase.recommended_projects
                              ?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                  Recommended Projects
                                </p>

                                <ul className="mt-2 space-y-3 text-sm text-slate-600">
                                  {phase.recommended_projects.map(
                                    (
                                      project,
                                      projectIndex,
                                    ) => {
                                      const projectKey =
                                        `roadmap-project-${project}`;

                                      return (
                                        <li
                                          key={`${project}-${projectIndex}`}
                                          className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                          <div>
                                            <span>
                                              • {project}
                                            </span>

                                            {matchingGap?.skill_gap_id && (
                                              <p className="mt-1 text-xs font-semibold text-pink-700">
                                                Addresses skill gap:{' '}
                                                {matchingGap.skill}
                                              </p>
                                            )}
                                          </div>

                                          {createdProjects.has(
                                            projectKey,
                                          ) ? (
                                            <span className="shrink-0 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                                              ✓ Project created
                                            </span>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleCreateProject(
                                                  project,
                                                  matchingGap,
                                                )
                                              }
                                              disabled={
                                                creatingProjectFor ===
                                                projectKey
                                              }
                                              className="shrink-0 rounded-lg bg-pink-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                              {creatingProjectFor ===
                                              projectKey
                                                ? 'Creating...'
                                                : 'Create Project'}
                                            </button>
                                          )}
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              </div>
                            )}

                            {phase.recommended_tasks
                              ?.length > 0 && (
                              <div className="mt-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                  Recommended Actions
                                </p>

                                <ul className="mt-2 space-y-3 text-sm text-slate-600">
                                  {phase.recommended_tasks.map(
                                    (
                                      task,
                                      taskIndex,
                                    ) => {
                                      const taskKey =
                                        `roadmap-task-${task}`;

                                      return (
                                        <li
                                          key={`${task}-${taskIndex}`}
                                          className="flex flex-col gap-2 rounded-xl bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                          <div>
                                            <span>
                                              • {task}
                                            </span>

                                            {matchingGap?.skill_gap_id && (
                                              <p className="mt-1 text-xs font-semibold text-pink-700">
                                                Addresses skill gap:{' '}
                                                {matchingGap.skill}
                                              </p>
                                            )}
                                          </div>

                                          {createdTasks.has(
                                            taskKey,
                                          ) ? (
                                            <span className="shrink-0 rounded-lg bg-green-100 px-3 py-2 text-xs font-bold text-green-700">
                                              ✓ Task created
                                            </span>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleCreateRoadmapTask(
                                                  task,
                                                  matchingGap,
                                                )
                                              }
                                              disabled={
                                                creatingTaskFor ===
                                                taskKey
                                              }
                                              className="shrink-0 rounded-lg bg-pink-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                              {creatingTaskFor ===
                                              taskKey
                                                ? 'Creating...'
                                                : 'Create Task'}
                                            </button>
                                          )}
                                        </li>
                                      );
                                    },
                                  )}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <p className="text-sm text-slate-500">
                  No roadmap was generated.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900 p-6 text-white">
            <p className="text-sm font-bold uppercase tracking-wide text-pink-300">
              Your Next Best Action
            </p>

            <p className="mt-3 text-lg leading-7">
              {result.next_action}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CareerRecommendations;
