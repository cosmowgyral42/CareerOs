import { useEffect, useState } from 'react';

import {
  analyzeCareerFit,
  getCareerTargets,
} from '../../services/api';


function CareerRecommendations() {
  const [careerTargets, setCareerTargets] = useState([]);
  const [careerTargetId, setCareerTargetId] = useState('');
  const [jobDescription, setJobDescription] = useState('');

  const [result, setResult] = useState(null);

  const [loadingTargets, setLoadingTargets] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

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
          err.message
            || 'Could not load career targets.',
        );
      } finally {
        if (isMounted) {
          setLoadingTargets(false);
        }
      }
    }

    loadCareerTargets();

    return () => {
      isMounted = false;
    };
  }, []);


  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setResult(null);

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
    } catch (err) {
      setError(
        err.message
          || 'Career analysis failed. Please try again.',
      );
    } finally {
      setAnalyzing(false);
    }
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
          Compare your career target and skills against a real
          job description to discover your strengths, skill gaps,
          roadmap, and next best action.
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
          Choose your career target and paste a job description.
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
                setCareerTargetId(
                  event.target.value,
                )
              }
              disabled={loadingTargets || analyzing}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              {loadingTargets && (
                <option value="">
                  Loading career targets...
                </option>
              )}

              {!loadingTargets
                && careerTargets.length === 0 && (
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
                setJobDescription(
                  event.target.value,
                )
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
                {jobDescription.trim().length}
                {' '}
                characters
              </span>
            </div>
          </div>


          <button
            type="submit"
            disabled={
              analyzing
              || loadingTargets
              || careerTargets.length === 0
            }
            className="rounded-xl bg-pink-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {analyzing
              ? 'Analyzing your career fit...'
              : 'Generate AI Career Insights'}
          </button>

        </form>
      </div>


      {result && (
        <div className="space-y-6">

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

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

                  {result.matched_skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-semibold text-green-700"
                      >
                        {skill}
                      </span>
                    ),
                  )}

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

                        <span>
                          {strength}
                        </span>
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
                  (gap, index) => (
                    <div
                      key={`${gap.skill}-${index}`}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                    >

                      <div className="flex flex-col justify-between gap-2 sm:flex-row">

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

                    </div>
                  ),
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

            <div className="mt-6 space-y-5">

              {result.roadmap?.length > 0 ? (
                result.roadmap.map(
                  (phase, index) => (
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


                          {phase.recommended_projects?.length > 0 && (
                            <div className="mt-4">

                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Recommended Projects
                              </p>

                              <ul className="mt-2 space-y-1 text-sm text-slate-600">

                                {phase.recommended_projects.map(
                                  (project, projectIndex) => (
                                    <li
                                      key={`${project}-${projectIndex}`}
                                    >
                                      • {project}
                                    </li>
                                  ),
                                )}

                              </ul>

                            </div>
                          )}


                          {phase.recommended_tasks?.length > 0 && (
                            <div className="mt-4">

                              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Recommended Actions
                              </p>

                              <ul className="mt-2 space-y-1 text-sm text-slate-600">

                                {phase.recommended_tasks.map(
                                  (task, taskIndex) => (
                                    <li
                                      key={`${task}-${taskIndex}`}
                                    >
                                      • {task}
                                    </li>
                                  ),
                                )}

                              </ul>

                            </div>
                          )}

                        </div>

                      </div>

                    </div>
                  ),
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