import { useState } from 'react';

function PasswordInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`w-full rounded-xl border bg-white px-4 py-3 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
            error
              ? 'border-red-300 ring-2 ring-red-100'
              : 'border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
          }`}
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-2 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default PasswordInput;