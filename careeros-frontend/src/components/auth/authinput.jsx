function AuthInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 ${
          error
            ? 'border-red-300 ring-2 ring-red-100'
            : 'border-slate-200 hover:border-slate-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10'
        }`}
      />

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

export default AuthInput;