import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const ToastContainer: React.FC = () => {
  const toasts = useUIStore((state) => state.toasts);
  const removeToast = useUIStore((state) => state.removeToast);

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[130] flex flex-col gap-2 pointer-events-none w-[90vw] max-w-md"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const duration = toast.duration ?? 4500;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto relative overflow-hidden rounded-2xl glass-tint bg-white/95 border border-border shadow-soft-hover p-4 flex items-center justify-between gap-3 text-sm text-ink-900"
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />}
                {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-status-error shrink-0" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-accent-700 shrink-0" />}
                <p className="font-medium text-xs sm:text-sm">{toast.message}</p>
              </div>

              <div className="flex items-center gap-2">
                {toast.actionLabel && toast.onAction && (
                  <button
                    onClick={() => {
                      toast.onAction?.();
                      removeToast(toast.id);
                    }}
                    className="text-xs font-bold px-3 py-1 bg-ink-900 text-brand-cream rounded-full hover:bg-black transition-colors"
                  >
                    {toast.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  aria-label="Dismiss notification"
                  className="p-1 rounded-full text-ink-600 hover:text-ink-900 hover:bg-black/5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Progress Bar */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-[2.5px] ${
                  toast.type === 'success'
                    ? 'bg-status-success'
                    : toast.type === 'error'
                    ? 'bg-status-error'
                    : 'bg-brand-green'
                }`}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
