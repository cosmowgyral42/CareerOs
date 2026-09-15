import {
  useRef,
  useState,
} from 'react';

import {
  analyzeResume,
  uploadResume,
} from '../../services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function ResumeAI() {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] =
    useState('');

  const [status, setStatus] =
    useState('idle');

  const [error, setError] =
    useState('');

  const [result, setResult] =
    useState(null);

  function handleFileChange(event) {
    const selectedFile =
      event.target.files?.[0];

    setError('');
    setResult(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const name =
      selectedFile.name.toLowerCase();

    const validExtension =
      name.endsWith('.pdf') ||
      name.endsWith('.docx');

    if (!validExtension) {
      setFile(null);
      setError(
        'Only PDF and DOCX resumes are supported.',
      );

      event.target.value = '';
      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFile(null);
      setError(
        'Resume must be 10 MB or smaller.',
      );

      event.target.value = '';
      return;
    }

    setFile(selectedFile);
  }

  async function handleAnalyze() {
    if (!file) {
      setError(
        'Please choose a resume first.',
      );
      return;
    }

    if (!jobDescription.trim()) {
      setError(
        'Please enter a job description.',
      );
      return;
    }

    setStatus('analyzing');
    setError('');
    setResult(null);

    try {
      const analysis =
        await uploadResume(
          file,
          jobDescription,
        );

      const completed =
        await analyzeResume(
          analysis.id,
        );

      let parsedResult = null;

      if (
        completed.analysis_result
      ) {
        try {
          parsedResult =
            JSON.parse(
              completed.analysis_result,
            );
        } catch {
          throw new Error(
            'The AI returned an invalid analysis result.',
          );
        }
      }

      if (!parsedResult) {
        throw new Error(
          'The analysis completed without a result.',
        );
      }

      setResult({
        ...completed,
        ...parsedResult,
      });

      setStatus('completed');
    } catch (err) {
      setStatus('error');

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to analyze the resume.',
      );
    }
  }

  function resetAnalysis() {
    setFile(null);
    setJobDescription('');
    setStatus('idle');
    setError('');
    setResult(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8FB] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <p className="font-sans text-sm font-semibold uppercase tracking-[0.18em] text-pink-500">
            Career intelligence
          </p>

          <h1 className="mt-2 font-serif text-4xl font-bold text-slate-900">
            Resume AI
          </h1>

          <p className="mt-3 max-w-2xl font-sans text-base leading-7 text-slate-600">
            Upload your resume and compare it
            against a target job description.
          </p>
        </section>

        {!result && (
          <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Upload your resume
                </h2>

                <p className="mt-2 font-sans text-sm leading-6 text-slate-500">
                  PDF and DOCX files up to 10 MB.
                </p>

                <button
                  type="button"
                  disabled={
                    status === 'analyzing'
                  }
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="mt-6 w-full rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 px-6 py-10 font-sans text-sm font-semibold text-pink-600 transition hover:border-pink-300 hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {file
                    ? file.name
                    : 'Choose PDF or DOCX'}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div>
                <label
                  htmlFor="job-description"
                  className="font-sans text-sm font-semibold text-slate-700"
                >
                  Job description
                </label>

                <textarea
                  id="job-description"
                  value={jobDescription}
                  disabled={
                    status === 'analyzing'
                  }
                  onChange={(event) =>
                    setJobDescription(
                      event.target.value,
                    )
                  }
                  rows={10}
                  placeholder="Paste the job description here..."
                  className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100 disabled:bg-slate-50"
                />
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 font-sans text-sm text-red-600">
                {error}
              </div>
            )}

            {status === 'analyzing' && (
              <div className="mt-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-yellow-200 border-t-yellow-500" />

                  <div>
                    <p className="font-sans text-sm font-semibold text-slate-900">
                      Analyzing your resume...
                    </p>

                    <p className="mt-1 font-sans text-xs text-slate-500">
                      Extracting skills, comparing
                      experience, and generating
                      recommendations.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={
                !file ||
                !jobDescription.trim() ||
                status === 'analyzing'
              }
              onClick={handleAnalyze}
              className="mt-7 w-full rounded-2xl bg-pink-500 px-5 py-3.5 font-sans text-sm font-bold text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'analyzing'
                ? 'Analyzing...'
                : 'Analyze Resume'}
            </button>
          </section>
        )}

        {result && (
          <section className="space-y-6">
            <div className="rounded-3xl border border-yellow-100 bg-yellow-50 p-6 shadow-sm">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <p className="font-sans text-sm font-semibold text-pink-500">
                    Analysis complete
                  </p>

                  <h2 className="mt-1 font-serif text-2xl font-bold text-slate-900">
                    {result.file_name}
                  </h2>
                </div>

                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-8 border-pink-200 bg-white">
                  <span className="font-serif text-3xl font-bold text-pink-500">
                    {result.match_score}
                  </span>

                  <span className="font-sans text-xs font-semibold text-slate-500">
                    / 100
                  </span>
                </div>
              </div>
            </div>

            <ResultCard
              title="Matched Skills"
              items={result.matched_skills}
              emptyText="No matched skills were identified."
            />

            <ResultCard
              title="Missing Skills"
              items={result.missing_skills}
              emptyText="No missing skills were identified."
              yellow
            />

            <ResultCard
              title="Strengths"
              items={result.strengths}
              emptyText="No strengths were returned."
            />

            <ResultCard
              title="Weaknesses"
              items={result.weaknesses}
              emptyText="No weaknesses were returned."
              yellow
            />

            <ResultCard
              title="Recommendations"
              items={result.recommendations}
              emptyText="No recommendations were returned."
            />

            {result.summary && (
              <section className="rounded-3xl border border-pink-100 bg-white p-6 shadow-sm">
                <h2 className="font-serif text-2xl font-bold text-slate-900">
                  Summary
                </h2>

                <p className="mt-3 font-sans text-sm leading-7 text-slate-600">
                  {result.summary}
                </p>
              </section>
            )}

            <button
              type="button"
              onClick={resetAnalysis}
              className="w-full rounded-2xl bg-yellow-300 px-5 py-3.5 font-sans text-sm font-bold text-slate-900 transition hover:bg-yellow-400"
            >
              Analyze another resume
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

function ResultCard({
  title,
  items,
  emptyText,
  yellow = false,
}) {
  return (
    <section
      className={`rounded-3xl border p-6 shadow-sm ${
        yellow
          ? 'border-yellow-100 bg-yellow-50'
          : 'border-pink-100 bg-white'
      }`}
    >
      <h2 className="font-serif text-2xl font-bold text-slate-900">
        {title}
      </h2>

      {items?.length ? (
        <ul className="mt-5 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="rounded-2xl bg-white px-4 py-3 font-sans text-sm leading-6 text-slate-700 shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-sans text-sm text-slate-500">
          {emptyText}
        </p>
      )}
    </section>
  );
}

export default ResumeAI;
