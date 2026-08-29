function Toast({
  message,
  type = 'success',
  onClose,
}) {
  const styles = {
    success: 'border-green-200 bg-green-50 text-green-800',
    error: 'border-red-200 bg-red-50 text-red-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 shadow-lg ${styles[type]}`}
      role="alert"
    >
      <p className="text-sm font-medium">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="text-lg leading-none opacity-70 transition hover:opacity-100"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;