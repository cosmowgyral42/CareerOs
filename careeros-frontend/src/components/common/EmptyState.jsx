function EmptyState({
  title,
  message,
  action,
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-pink-200 bg-white p-8 text-center">
      <h2 className="text-2xl font-bold text-[#29252D]">
        {title}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
        {message}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;