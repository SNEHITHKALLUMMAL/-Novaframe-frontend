import { cn } from '../lib/utils.js';

const COLOR_STYLES = {
  primary: {
    icon: 'text-primary',
    value: 'text-primary',
    bg: 'bg-primary/10',
  },
  accent: {
    icon: 'text-accent',
    value: 'text-accent',
    bg: 'bg-accent/10',
  },
  info: {
    icon: 'text-info',
    value: 'text-info',
    bg: 'bg-info/10',
  },
  destructive: {
    icon: 'text-destructive-text',
    value: 'text-destructive-text',
    bg: 'bg-destructive/10',
  },
  highlight: {
    icon: 'text-highlight',
    value: 'text-highlight',
    bg: 'bg-highlight/10',
  },
};

export function StatCard({ label, value, icon: Icon, color = 'primary', className }) {
  const colors = COLOR_STYLES[color] || COLOR_STYLES.primary;

  return (
    <div className={cn('rounded-xl border border-border bg-card p-4 space-y-3 card-glow', className)}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {Icon && (
          <div className={cn('flex items-center justify-center h-8 w-8 rounded-lg', colors.bg)}>
            <Icon className={cn('h-4 w-4', colors.icon)} />
          </div>
        )}
      </div>
      <p className={cn('text-2xl font-bold', colors.value)}>{value ?? 0}</p>
    </div>
  );
}
