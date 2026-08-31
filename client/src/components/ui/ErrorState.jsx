import { AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils.js';
import { Button } from './Button.jsx';

/**
 * Reusable failed-request view with a retry button (SRS error_handling.frontend:
 * "Error states", "Retry buttons"). Distinct from EmptyState — this means a
 * request actually failed, not that it succeeded with zero results.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'The request failed. Please try again.',
  onRetry,
  className,
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center px-6', className)}>
      <div className="rounded-full bg-destructive/10 p-3">
        <AlertTriangle className="h-6 w-6 text-destructive-text" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
