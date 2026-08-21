import { cn } from '../../lib/utils.js';
import { Button } from './Button.jsx';

/**
 * Reusable "nothing here yet" view. Every list/collection page (video
 * library, projects, notifications, admin tables) uses this instead of
 * rendering a blank space when a query returns zero results.
 */
export function EmptyState({ icon: Icon, title, description, actionLabel, onAction, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center px-6', className)}>
      {Icon && (
        <div className="rounded-full bg-secondary p-3">
          <Icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-sm">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
