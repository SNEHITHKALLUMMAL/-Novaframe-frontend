import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '../../services/admin.service.js';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export function AuditLogTab() {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin', 'audit-logs', { page }],
    queryFn: () => fetchAuditLogs({ page }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading) return <LoadingState label="Loading audit log…" />;
  if (query.isError) return <ErrorState onRetry={query.refetch} description="Couldn't load audit log." />;

  const { logs, total, limit } = query.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (logs.length === 0) {
    return <EmptyState title="No audit entries yet" description="Admin actions (role changes, moderation, etc.) will appear here." />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-4 py-2">Actor</th>
              <th className="text-left font-medium px-4 py-2">Action</th>
              <th className="text-left font-medium px-4 py-2">Target</th>
              <th className="text-left font-medium px-4 py-2">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="px-4 py-2.5 text-foreground">{log.actor?.name ?? 'Unknown'}</td>
                <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{log.action}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {log.targetType ? `${log.targetType}${log.targetId ? ` (${log.targetId.slice(-6)})` : ''}` : '—'}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
