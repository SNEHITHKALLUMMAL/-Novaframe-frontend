import { useQuery } from '@tanstack/react-query';
import { fetchHealth } from '../services/health.service.js';

export default function SystemStatusPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-lg border border-border bg-card p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          AI Video Generation Platform
        </h1>
        <p className="text-muted-foreground mb-6">Phase 2 — Infrastructure Check</p>

        {isLoading && <p className="text-sm text-muted-foreground">Checking backend status…</p>}

        {isError && (
          <p className="text-sm text-destructive-text">
            Could not reach the API ({error?.message ?? 'unknown error'}). Make sure the server is
            running on the configured port.
          </p>
        )}

        {data && (
          <div className="text-left text-sm space-y-1 bg-secondary rounded-md p-4">
            <p>
              <span className="text-muted-foreground">API:</span> {data.data.api}
            </p>
            <p>
              <span className="text-muted-foreground">MongoDB:</span> {data.data.mongodb}
            </p>
            <p>
              <span className="text-muted-foreground">Redis:</span> {data.data.redis}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
