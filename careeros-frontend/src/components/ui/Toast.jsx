import {
  CheckCircle2,
  Info,
  X,
  XCircle,
} from 'lucide-react';

function Toast({
  message,
  type = 'success',
  onClose,
}) {
  const config = {
    success: {
      icon: CheckCircle2,
      classes:
        'border-emerald-200 bg-emerald-50 text-emerald-800',
    },

    error: {
      icon: XCircle,
      classes:
        'border-red-200 bg-red-50 text-red-800',
    },

    info: {
      icon: Info,
      classes:
        'border-blue-200 bg-blue-50 text-blue-800',
    },
  };

  const current = config[type] || config.info;

  const Icon = current.icon;

  return (
    <div
      className={[
        'flex w-full items-start justify-between gap-4 rounded-2xl border p-4 shadow-xl',
        current.classes,
      ].join(' ')}
      role="alert"
    >
      <div className="flex min-w-0 items-start gap-3">
        <Icon
          size={20}
          className="mt-0.5 shrink-0"
        />

        <p className="text-sm font-semibold leading-6">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="shrink-0 rounded-lg p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
      >
        <X size={18} />
      </button>
    </div>
  );
}

export default Toast;