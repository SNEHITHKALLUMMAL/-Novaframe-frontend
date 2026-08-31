import { cn } from '../lib/utils.js';

export function StatCard({ label, value, icon: Icon, className }) {
  return (
    <div className={cn('rounded-lg border border-border bg-card p-4 space-y-2', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="text-2xl font-semibold text-foreground">{value ?? 0}</p>
    </div>
  );
}
