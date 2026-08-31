import { cn } from '../lib/utils.js';

const STATUS_STYLES = {
  PENDING: 'bg-secondary text-muted-foreground',
  QUEUED: 'bg-secondary text-muted-foreground',
  PROCESSING: 'bg-primary/15 text-primary',
  RETRYING: 'bg-amber-500/15 text-amber-400',
  COMPLETED: 'bg-emerald-500/15 text-emerald-400',
  READY: 'bg-emerald-500/15 text-emerald-400',
  FAILED: 'bg-destructive/15 text-destructive-text',
  TIMEOUT: 'bg-destructive/15 text-destructive-text',
  CANCELLED: 'bg-secondary text-muted-foreground',
};

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? 'bg-secondary text-muted-foreground';
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize',
        style,
        className
      )}
    >
      {status?.toLowerCase()}
    </span>
  );
}
