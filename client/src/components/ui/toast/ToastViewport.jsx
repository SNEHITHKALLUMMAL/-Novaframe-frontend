import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { useToast } from './ToastContext.jsx';
import { cn } from '../../../lib/utils.js';

const variantConfig = {
  default: { icon: Info, className: 'border-border' },
  success: { icon: CheckCircle2, className: 'border-primary/50' },
  destructive: { icon: XCircle, className: 'border-destructive/50' },
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => {
          const { icon: Icon, className } = variantConfig[t.variant] ?? variantConfig.default;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              role="status"
              className={cn(
                'flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg',
                className
              )}
            >
              <Icon className="h-5 w-5 shrink-0 text-foreground mt-0.5" aria-hidden="true" />
              <div className="flex-1 min-w-0">
                {t.title && <p className="text-sm font-medium text-foreground">{t.title}</p>}
                {t.description && (
                  <p className="text-sm text-muted-foreground mt-0.5">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
