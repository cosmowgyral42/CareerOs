import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AuthInput from '../../components/auth/AuthInput';
import AuthLayout from '../../components/auth/AuthLayout';
import PasswordInput from '../../components/auth/PasswordInput';
import { getApiErrorMessage, registerUser } from '../../services/api';

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    setServerError('');
  }

  function validate() {
    const nextErrors = {};

    if (!form.fullName.trim()) {
      nextErrors.fullName = 'Full name is required.';
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Name must contain at least 2 characters.';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!form.password) {
      nextErrors.password = 'Password is required.';
    } else if (form.password.length < 8) {
      nextErrors.password =
        'Password must contain at least 8 characters.';
    }

    if (!form.confirmPassword) {
      nextErrors.confirmPassword =
        'Please confirm your password.';
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setServerError('');
    setIsSubmitting(true);

    try {
      await registerUser({
        full_name: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        timezone: 'UTC',
      });

      navigate('/login', {
        replace: true,
        state: {
          message: 'Account created successfully. Please sign in.',
        },
      });
    } catch (error) {
      setServerError(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Build your career workspace."
      subtitle="Create your CareerOS account and start turning your career goals into measurable progress."
      footerText="Already have an account?"
      footerLink="/login"
      footerLabel="Sign in"
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {serverError && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {serverError}
          </div>
        )}

        <AuthInput
          label="Full name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="Your name"
          autoComplete="name"
          error={errors.fullName}
        />

        <AuthInput
          label="Email address"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />

        <PasswordInput
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password}
        />

        <PasswordInput
          label="Confirm password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />

        <label className="flex items-start gap-3 text-sm text-slate-500">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-violet-600"
          />

          <span>
            I agree to the CareerOS terms and understand how my account
            data is used.
          </span>
        </label>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;