function EmptyState({
  title = 'Nothing here yet',
  message = 'Create your first item to get started.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-bold text-slate-800">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;