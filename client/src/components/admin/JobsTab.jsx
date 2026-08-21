import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminJobs } from '../../services/admin.service.js';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { StatusBadge } from '../StatusBadge.jsx';

export function JobsTab() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const jobsQuery = useQuery({
    queryKey: ['admin', 'jobs', { status, page }],
    queryFn: () => fetchAdminJobs({ status: status || undefined, page }),
    placeholderData: (prev) => prev,
  });

  if (jobsQuery.isLoading) return <LoadingState label="Loading jobs…" />;
  if (jobsQuery.isError) return <ErrorState onRetry={jobsQuery.refetch} description="Couldn't load jobs." />;

  const { jobs, total, limit } = jobsQuery.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <Select aria-label="Filter jobs by status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="w-auto">
        <option value="">All statuses</option>
        <option value="PENDING">Pending</option>
        <option value="QUEUED">Queued</option>
        <option value="PROCESSING">Processing</option>
        <option value="COMPLETED">Completed</option>
        <option value="FAILED">Failed</option>
        <option value="CANCELLED">Cancelled</option>
      </Select>

      {jobs.length === 0 ? (
        <EmptyState title="No jobs found" description="Try a different filter." />
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2">User</th>
                <th className="text-left font-medium px-4 py-2">Type</th>
                <th className="text-left font-medium px-4 py-2">Model</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="px-4 py-2.5 text-foreground">{job.owner?.name ?? 'Unknown'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{job.type}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{job.aiModel?.name ?? '—'}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {new Date(job.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
