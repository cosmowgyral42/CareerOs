import { useEffect, useState } from 'react';

import {
  analyzeResume,
  getResumeAnalyses,
  uploadResume,
} from '../../services/api';

function ResumeAnalysis() {
  const [analyses, setAnalyses] = useState([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAnalyses() {
      try {
        const data = await getResumeAnalyses();

        if (cancelled) {
          return;
        }

        setAnalyses(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load resume analyses.',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAnalyses();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      setError('Please select a PDF or DOCX resume.');
      return;
    }

    setError('');
    setIsUploading(true);

    try {
      const analysis = await uploadResume(
        file,
        jobDescription.trim() || null,
      );

      setAnalyses((current) => [
        analysis,
        ...current.filter(
          (item) => item.id !== analysis.id,
        ),
      ]);

      setSelectedAnalysis(analysis);
      setFile(null);
      setJobDescription('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to upload resume.',
      );
    } finally {
      setIsUploading(false);
    }
  }

  async function handleAnalyze(analysisId) {
    setError('');
    setIsAnalyzing(true);

    try {
      const result = await analyzeResume(analysisId);

      setSelectedAnalysis(result);

      setAnalyses((current) =>
        current.map((item) =>
          item.id === result.id
            ? result
            : item,
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze resume.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-pink-500" />

          <p className="mt-4 font-sans text-sm font-medium text-slate-500">
            Loading Resume AI...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-pink-500">
          CareerOS AI
        </p>

        <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-slate-900">
          Resume Analysis
        </h1>

        <p className="mt-3 max-w-2xl font-sans text-sm leading-6 text-slate-500">
          Upload your resume and compare it against a
          target job description to discover your match
          score, skills, weaknesses, strengths, and
          recommendations.
        </p>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
          <p className="font-sans text-sm font-semibold text-red-800">
            {error}
          </p>
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <form
          onSubmit={handleUpload}
          className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm"
        >
          <div>
            <p className="font-sans text-sm font-bold text-pink-500">
              Step 1
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              Upload your resume
            </h2>
          </div>

          <div className="mt-6">
            <label
              htmlFor="resume-file"
              className="font-sans text-sm font-semibold text-slate-700"
            >
              Resume file
            </label>

            <input
              id="resume-file"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(event) => {
                setFile(
                  event.target.files?.[0] ?? null,
                );
              }}
              className="mt-2 block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-pink-100 file:px-4 file:py-2 file:font-semibold file:text-pink-700"
            />

            <p className="mt-2 font-sans text-xs text-slate-400">
              Supported formats: PDF and DOCX.
            </p>
          </div>

          <div className="mt-6">
            <label
              htmlFor="job-description"
              className="font-sans text-sm font-semibold text-slate-700"
            >
              Job description
            </label>

            <textarea
              id="job-description"
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(event.target.value)
              }
              rows={8}
              placeholder="Paste the job description here..."
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 font-sans text-sm text-slate-700 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <button
            type="submit"
            disabled={!file || isUploading}
            className="mt-6 w-full rounded-xl bg-pink-500 px-5 py-3 font-sans text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading
              ? 'Uploading...'
              : 'Upload Resume'}
          </button>
        </form>

        <section className="rounded-3xl border border-[#F3E8D2] bg-linear-to-br from-[#FFF8E7] to-pink-50 p-7">
          <p className="font-sans text-sm font-bold text-pink-600">
            How it works
          </p>

          <div className="mt-6 space-y-5">
            <Step
              number="01"
              title="Upload"
              text="Add your PDF or DOCX resume."
            />

            <Step
              number="02"
              title="Compare"
              text="Provide the job description you are targeting."
            />

            <Step
              number="03"
              title="Analyze"
              text="CareerOS AI evaluates the resume against the role."
            />

            <Step
              number="04"
              title="Improve"
              text="Use the identified gaps and recommendations to improve your resume."
            />
          </div>
        </section>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-sans text-sm font-bold text-pink-500">
              Analysis history
            </p>

            <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
              Your resumes
            </h2>
          </div>

          <span className="rounded-xl bg-yellow-300 px-4 py-2 font-sans text-sm font-bold text-slate-900">
            {analyses.length} total
          </span>
        </div>

        {analyses.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
            <p className="font-serif text-xl font-bold text-slate-800">
              No analyses yet
            </p>

            <p className="mt-2 font-sans text-sm text-slate-500">
              Upload your first resume above to get started.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {analyses.map((analysis) => (
              <div
                key={analysis.id}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-sans text-base font-bold text-slate-900">
                      {analysis.file_name ||
                        'Resume'}
                    </p>

                    <p className="mt-1 font-sans text-xs text-slate-500">
                      Status:{' '}
                      {analysis.status ||
                        'pending'}
                    </p>
                  </div>

                  {analysis.status ===
                    'completed' ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedAnalysis(
                          analysis,
                        )
                      }
                      className="rounded-xl bg-yellow-300 px-4 py-2 font-sans text-sm font-bold text-slate-900 hover:bg-yellow-400"
                    >
                      View analysis
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isAnalyzing}
                      onClick={() =>
                        handleAnalyze(
                          analysis.id,
                        )
                      }
                      className="rounded-xl bg-pink-500 px-4 py-2 font-sans text-sm font-bold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isAnalyzing
                        ? 'Analyzing...'
                        : 'Analyze resume'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedAnalysis && (
        <AnalysisResult
          analysis={selectedAnalysis}
          onClose={() =>
            setSelectedAnalysis(null)
          }
        />
      )}
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-300 font-sans text-xs font-bold text-slate-900">
        {number}
      </div>

      <div>
        <h3 className="font-serif text-lg font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 font-sans text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}

function AnalysisResult({ analysis, onClose }) {
  let result = null;

  if (analysis?.analysis_result) {
    try {
      result =
        typeof analysis.analysis_result ===
        'string'
          ? JSON.parse(
              analysis.analysis_result,
            )
          : analysis.analysis_result;
    } catch {
      result = null;
    }
  }

  return (
    <section className="rounded-3xl border border-pink-100 bg-white p-7 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-sans text-sm font-bold text-pink-500">
            AI results
          </p>

          <h2 className="mt-1 font-serif text-3xl font-bold text-slate-900">
            {analysis.file_name ||
              'Resume analysis'}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-4 py-2 font-sans text-sm font-semibold text-slate-600 hover:bg-slate-50"
        >
          Close
        </button>
      </div>

      {!result ? (
        <div className="mt-6 rounded-2xl bg-yellow-50 p-6">
          <p className="font-sans text-sm font-semibold text-slate-700">
            This analysis does not contain AI
            results yet.
          </p>

          <p className="mt-2 font-sans text-sm text-slate-500">
            Start the analysis using the Analyze
            resume button above.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <ResultCard
              label="Match score"
              value={`${result.match_score ?? 0}%`}
            />

            <ResultCard
              label="Matched skills"
              value={
                Array.isArray(
                  result.matched_skills,
                )
                  ? result.matched_skills.length
                  : 0
              }
            />

            <ResultCard
              label="Missing skills"
              value={
                Array.isArray(
                  result.missing_skills,
                )
                  ? result.missing_skills.length
                  : 0
              }
            />

            <ResultCard
              label="Recommendations"
              value={
                Array.isArray(
                  result.recommendations,
                )
                  ? result.recommendations.length
                  : 0
              }
            />
          </div>

          <div className="mt-7 grid gap-6 lg:grid-cols-2">
            <ResultList
              title="Matched skills"
              items={result.matched_skills}
            />

            <ResultList
              title="Missing skills"
              items={result.missing_skills}
            />

            <ResultList
              title="Strengths"
              items={result.strengths}
            />

            <ResultList
              title="Weaknesses"
              items={result.weaknesses}
            />

            <ResultList
              title="Recommendations"
              items={result.recommendations}
            />

            <div className="rounded-2xl bg-slate-50 p-6">
              <p className="font-sans text-sm font-bold text-pink-500">
                Summary
              </p>

              <p className="mt-3 font-sans text-sm leading-7 text-slate-600">
                {result.summary ||
                  'No summary available.'}
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function ResultCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="font-sans text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-3 font-serif text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function ResultList({ title, items }) {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <h3 className="font-serif text-xl font-bold text-slate-900">
        {title}
      </h3>

      {safeItems.length === 0 ? (
        <p className="mt-3 font-sans text-sm text-slate-500">
          None available.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {safeItems.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-xl bg-slate-50 px-4 py-3 font-sans text-sm leading-6 text-slate-600"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ResumeAnalysis;