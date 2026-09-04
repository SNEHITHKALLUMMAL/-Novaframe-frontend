import { Video, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export function LoadingState({ label = 'Loading…', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-12', className)}>
      <div className="relative">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
          <Video className="h-5 w-5 text-primary" />
        </div>
        <Loader2 className="absolute -top-1 -right-1 h-4 w-4 animate-spin text-primary" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
