import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, CheckCircle, XCircle, RefreshCw, Video, Sparkles } from 'lucide-react';
import { fetchGeneration } from '../../services/generation.service.js';
import { StatusBadge } from '../StatusBadge.jsx';
import { Button } from '../ui/Button.jsx';

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
      <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Loading job status…</p>
          <p className="text-xs text-muted-foreground">Checking generation progress</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 flex items-center gap-4">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-destructive/10">
          <XCircle className="h-5 w-5 text-destructive-text" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">Could not load job status</p>
          <p className="text-xs text-muted-foreground">Something went wrong while checking progress.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  const status = data?.status;
  const isTerminal = status === 'completed' || status === 'failed' || status === 'cancelled';

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10">
            {status === 'completed' && <CheckCircle className="h-5 w-5 text-success" />}
            {status === 'failed' && <XCircle className="h-5 w-5 text-destructive-text" />}
            {!['completed', 'failed'].includes(status) && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Job {jobId.slice(-8)}</p>
            <StatusBadge status={status} />
          </div>
        </div>
        {isTerminal && (
          <Button variant="ghost" size="sm" onClick={onReset} className="text-primary">
            <Sparkles className="h-4 w-4" />
            New generation
          </Button>
        )}
      </div>

      {status === 'completed' && data?.videoUrl && (
        <div className="rounded-xl overflow-hidden border border-border">
          <video controls className="w-full" src={data.videoUrl} />
        </div>
      )}

      {data?.error && (
        <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-3">
          <p className="text-xs text-destructive-text">{data.error}</p>
        </div>
      )}
    </div>
  );
}
