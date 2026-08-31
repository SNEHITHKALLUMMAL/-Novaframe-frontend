import { cn } from '../lib/utils.js';

const STATUS_STYLES = {
  COMPLETED: 'bg-green-500/15 text-green-400',
  completed: 'bg-green-500/15 text-green-400',
  ready: 'bg-green-500/15 text-green-400',
  PROCESSING: 'bg-blue-500/15 text-blue-400',
  processing: 'bg-blue-500/15 text-blue-400',
  generating: 'bg-blue-500/15 text-blue-400',
  QUEUED: 'bg-yellow-500/15 text-yellow-400',
  queued: 'bg-yellow-500/15 text-yellow-400',
  PENDING: 'bg-yellow-500/15 text-yellow-400',
  pending: 'bg-yellow-500/15 text-yellow-400',
  uploading: 'bg-purple-500/15 text-purple-400',
  FAILED: 'bg-red-500/15 text-red-400',
  failed: 'bg-red-500/15 text-red-400',
  CANCELLED: 'bg-gray-500/15 text-gray-400',
  cancelled: 'bg-gray-500/15 text-gray-400',
};

export function StatusBadge({ status, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
        STATUS_STYLES[status] || 'bg-secondary text-muted-foreground',
        className
      )}
    >
      {status}
    </span>
  );
}
