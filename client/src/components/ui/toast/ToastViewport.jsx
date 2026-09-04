import { useToast } from './ToastContext.jsx';
import { cn } from '../../../lib/utils.js';
import { CheckCircle, XCircle, Info } from 'lucide-react';

const variantStyles = {
  default: 'border-border',
  success: 'border-success/30',
  destructive: 'border-destructive/30',
};

const variantIcons = {
  success: CheckCircle,
  destructive: XCircle,
  default: Info,
};

const variantIconColors = {
  success: 'text-success',
  destructive: 'text-destructive-text',
  default: 'text-primary',
};

export function ToastViewport() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => {
        const Icon = variantIcons[t.variant] || variantIcons.default;
        const iconColor = variantIconColors[t.variant] || variantIconColors.default;

        return (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto rounded-xl border bg-card shadow-lg p-4 animate-in fade-in slide-in-from-bottom-2',
              variantStyles[t.variant] || variantStyles.default
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('mt-0.5 shrink-0', iconColor)}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{t.title}</p>
                {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-muted-foreground hover:text-foreground shrink-0 text-lg leading-none"
                aria-label="Dismiss"
              >
                ×
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
