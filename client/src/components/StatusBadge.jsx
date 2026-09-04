import { cn } from '../lib/utils.js';

const STATUS_STYLES = {
  COMPLETED: 'bg-success/15 text-success-text border-success/20',
  completed: 'bg-success/15 text-success-text border-success/20',
  ready: 'bg-success/15 text-success-text border-success/20',
  PROCESSING: 'bg-info/15 text-info-text border-info/20',
  processing: 'bg-info/15 text-info-text border-info/20',
  generating: 'bg-info/15 text-info-text border-info/20',
  QUEUED: 'bg-warning/15 text-warning-text border-warning/20',
  queued: 'bg-warning/15 text-warning-text border-warning/20',
  PENDING: 'bg-warning/15 text-warning-text border-warning/20',
  pending: 'bg-warning/15 text-warning-text border-warning/20',
  uploading: 'bg-primary/15 text-primary border-primary/20',
  FAILED: 'bg-destructive/15 text-destructive-text border-destructive/20',
  failed: 'bg-destructive/15 text-destructive-text border-destructive/20',
  CANCELLED: 'bg-secondary text-muted-foreground border-border',
  cancelled: 'bg-secondary text-muted-foreground border-border',
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize',
        STATUS_STYLES[status] || 'bg-secondary text-muted-foreground border-border',
        className
      )}
    >
      {status}
    </span>
  );
}
