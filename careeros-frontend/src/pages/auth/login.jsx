import { useState } from 'react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import {
  getCurrentUser,
  loginUser,
} from '../../services/api';

import { useAuth } from '../../context/useAuth';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    setUser,
    isLoading,
  } = useAuth();

  const [email, setEmail] = useState(
    location.state?.email || '',
  );

  const [password, setPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);

      await loginUser(
        email.trim(),
        password,
      );

      const currentUser =
        await getCurrentUser();

      setUser(currentUser);

      navigate('/dashboard', {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to log in.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F9FC]">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-violet-600" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading CareerOS...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FC] px-4 py-10 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-2">

        <section className="hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
            CareerOS
          </p>

          <h1 className="mt-5 max-w-xl text-5xl font-bold tracking-tight text-slate-900">
            Welcome back to your career workspace.
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-slate-500">
            Track your goals, projects, applications,
            skills, and career progress from one place.
          </p>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/50 sm:p-9">

            <p className="text-sm font-semibold text-violet-600">
              CareerOS
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Sign in
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Continue building your career.
            </p>

            {location.state?.registered && (
              <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                Account created successfully. Sign in
                to continue.
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="text-sm font-semibold text-slate-700"
                >
                  Email
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  required
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? 'Signing in...'
                  : 'Sign in'}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{' '}

              <Link
                to="/register"
                className="font-bold text-violet-600 hover:text-violet-700"
              >
                Create one
              </Link>
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}

export default Login;