import { useToast } from './ToastContext.jsx';
import { cn } from '../../../lib/utils.js';

const variantStyles = {
  default: 'bg-card border-border',
  success: 'bg-card border-green-500/30',
  destructive: 'bg-card border-destructive/30',
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'pointer-events-auto rounded-lg border p-4 shadow-lg bg-card animate-in fade-in slide-in-from-bottom-2',
            variantStyles[t.variant] || variantStyles.default
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{t.title}</p>
              {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground shrink-0">
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
