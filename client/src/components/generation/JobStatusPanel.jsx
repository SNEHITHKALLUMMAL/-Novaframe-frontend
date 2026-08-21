import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { XCircle, Wifi, WifiOff } from 'lucide-react';
import { fetchGeneration, cancelGeneration } from '../../services/generation.service.js';
import { getSocket } from '../../lib/socket.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { StatusBadge } from '../StatusBadge.jsx';
import { ProgressBar } from '../ProgressBar.jsx';

const TERMINAL_STATUSES = ['COMPLETED', 'FAILED', 'CANCELLED'];
// Real-time updates arrive via Socket.IO (see the effect below) — this
// interval is only a safety net for missed events (e.g. a brief
// disconnect), not the primary update mechanism, so it can be much
// slower than Phase 13's original 2s constant-polling implementation.
const FALLBACK_POLL_MS = 15000;

/**
 * Shared by every generation mode's page (text-to-video, image-to-video,
 * text+image-to-video) — tracks a job until it reaches a terminal state and
 * renders its live status/progress/result/error. One implementation, reused
 * rather than duplicated per mode.
 */
export function JobStatusPanel({ jobId, onReset }) {
  const queryClient = useQueryClient();

  const jobQuery = useQuery({
    queryKey: ['generation', jobId],
    queryFn: () => fetchGeneration(jobId),
    enabled: !!jobId,
    refetchInterval: (query) =>
      query.state.data && TERMINAL_STATUSES.includes(query.state.data.status) ? false : FALLBACK_POLL_MS,
  });

  // Real-time path: the server pushes a 'job:update' event (see
  // server/src/realtime/socketServer.js) the moment the worker or the
  // cancel endpoint changes this job's state. Rather than trying to keep a
  // separate copy of the job's shape in sync from the socket payload, this
  // just triggers an immediate refetch of the real REST endpoint — one
  // source of truth (GET /generations/:id), sockets are purely the "go
  // fetch now" signal. This also means a client that never received the
  // Phase 13/14 polling implementation still works exactly the same way,
  // just faster and with far fewer requests.
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(() => getSocket().connected);

  useEffect(() => {
    if (!jobId) return;
    const socket = getSocket();

    function handleUpdate(event) {
      if (event.generationJobId === jobId) {
        queryClient.invalidateQueries({ queryKey: ['generation', jobId] });
      }
    }
    function handleConnect() {
      setIsRealtimeConnected(true);
      // A reconnect may have missed events while offline — resync once.
      queryClient.invalidateQueries({ queryKey: ['generation', jobId] });
    }
    function handleDisconnect() {
      setIsRealtimeConnected(false);
    }

    socket.on('job:update', handleUpdate);
    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    return () => {
      socket.off('job:update', handleUpdate);
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, [jobId, queryClient]);

  const cancelMutation = useMutation({
    mutationFn: () => cancelGeneration(jobId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['generation', jobId] }),
  });

  const job = jobQuery.data;
  const isTerminal = job && TERMINAL_STATUSES.includes(job.status);

  useEffect(() => {
    if (job?.status === 'COMPLETED') {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'summary'] });
    }
  }, [job?.status, queryClient]);

  if (!jobId) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generation status</CardTitle>
          <div className="flex items-center gap-2">
            {job && !isTerminal && (
              <span
                title={isRealtimeConnected ? 'Live updates connected' : 'Live updates unavailable — polling'}
                className="text-muted-foreground"
              >
                {isRealtimeConnected ? (
                  <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <WifiOff className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </span>
            )}
            {job && <StatusBadge status={job.status} />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {jobQuery.isLoading && <LoadingState label="Loading job status…" />}

        {job && !isTerminal && (
          <>
            <ProgressBar percent={job.progressPercent} />
            <p className="text-sm text-muted-foreground">
              {job.status === 'QUEUED'
                ? `Queued — position ${job.queuePosition ?? '—'}`
                : `Processing… ${job.progressPercent}%`}
            </p>
            {['PENDING', 'QUEUED'].includes(job.status) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => cancelMutation.mutate()}
                isLoading={cancelMutation.isPending}
              >
                <XCircle className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </>
        )}

        {job?.status === 'COMPLETED' && job.outputVideo && (
          <video
            controls
            className="w-full rounded-md border border-border"
            src={job.outputVideo.fileUrl}
            poster={job.outputVideo.thumbnailUrl}
          />
        )}

        {job?.status === 'FAILED' && (
          <ErrorState
            title="Generation failed"
            description={job.error?.message || 'Something went wrong during generation.'}
            onRetry={onReset}
          />
        )}

        {job?.status === 'CANCELLED' && (
          <p className="text-sm text-muted-foreground">This generation was cancelled.</p>
        )}
      </CardContent>
    </Card>
  );
}
