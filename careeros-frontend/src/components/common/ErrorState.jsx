function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred.',
  actionLabel = 'Try again',
  onRetry,
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
      <h2 className="text-xl font-bold text-red-700">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-red-600">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default ErrorState;