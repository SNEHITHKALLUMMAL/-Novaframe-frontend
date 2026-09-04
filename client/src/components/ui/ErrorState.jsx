import { AlertTriangle } from 'lucide-react';
import { Button } from './Button.jsx';
import { cn } from '../../lib/utils.js';

export function ErrorState({ description = 'Something went wrong.', onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive-text" />
      </div>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
