function LoadingState({
  message = 'Loading...',
}) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-4 rounded-3xl border border-[#E9E4EA] bg-white p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-pink-200 border-t-pink-500" />

      <p className="text-sm font-medium text-slate-500">
        {message}
      </p>
    </div>
  );
}

export default LoadingState;