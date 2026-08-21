import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function Spinner({ className, size = 24 }) {
  return (
    <Loader2
      className={cn('animate-spin text-muted-foreground', className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}

/**
 * Full-section loading state — drop into any page/list while data is
 * fetching, so no view ships without an explicit loading affordance
 * (SRS error_handling.frontend requirement).
 */
export function LoadingState({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      <Spinner size={28} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
