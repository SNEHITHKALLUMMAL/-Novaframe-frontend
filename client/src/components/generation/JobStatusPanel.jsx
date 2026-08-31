import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { fetchGeneration } from '../../services/generation.service.js';
import { StatusBadge } from '../StatusBadge.jsx';
import { Button } from '../ui/Button.jsx';
import { cn } from '../../lib/utils.js';

export function JobStatusPanel({ jobId, onReset }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchGeneration(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed' || status === 'cancelled') return false;
      return 3000;
    },
  });

  if (!jobId) return null;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading job status…</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
        <XCircle className="h-5 w-5 text-destructive-text" />
        <span className="text-sm text-muted-foreground">Could not load job status.</span>
        <Button variant="ghost" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  const status = data?.status;
  const isTerminal = status === 'completed' || status === 'failed' || status === 'cancelled';

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {status === 'completed' && <CheckCircle className="h-5 w-5 text-green-400" />}
          {status === 'failed' && <XCircle className="h-5 w-5 text-destructive-text" />}
          {!['completed', 'failed'].includes(status) && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          <div>
            <p className="text-sm font-medium text-foreground">Job {jobId.slice(-8)}</p>
            <StatusBadge status={status} />
          </div>
        </div>
        {isTerminal && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            New generation
          </Button>
        )}
      </div>

      {status === 'completed' && data?.videoUrl && (
        <video controls className="w-full rounded-md" src={data.videoUrl} />
      )}

      {data?.error && (
        <p className="text-xs text-destructive-text">{data.error}</p>
      )}
    </div>
  );
}
