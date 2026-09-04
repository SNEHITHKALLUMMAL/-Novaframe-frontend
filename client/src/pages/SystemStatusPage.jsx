import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../services/health.service.js';
import { Activity, Database, Wifi } from 'lucide-react';
import { BrightBotsLogo, BrightBotsIcon } from '../components/brand/BrightBotsLogo.jsx';

export default function SystemStatusPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-tech-grid">
      <div className="max-w-md w-full rounded-xl border border-border bg-card p-8 text-center space-y-6">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 mx-auto">
          <Activity className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Status</h1>
          <p className="text-muted-foreground mt-1">NovaFrame Platform Health</p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-4">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground">Checking backend status…</p>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm text-destructive-text">
              Could not reach the API ({error?.message ?? 'unknown error'}).
            </p>
          </div>
        )}

        {data && (
          <div className="text-left text-sm space-y-2">
            {[
              { label: 'API', value: data.data.api, icon: Activity },
              { label: 'MongoDB', value: data.data.mongodb, icon: Database },
              { label: 'Redis', value: data.data.redis, icon: Wifi },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 px-4 py-2.5">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
                <span className="font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <BrightBotsLogo size="sm" />
        </div>
      </div>
    </main>
  );
}
