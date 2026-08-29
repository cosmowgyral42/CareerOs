function LoadingState({
  message = 'Loading...',
}) {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-violet-600" />

      <p className="text-sm font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;