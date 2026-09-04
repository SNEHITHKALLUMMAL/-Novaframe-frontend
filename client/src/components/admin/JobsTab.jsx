import { useQuery } from '@tanstack/react-query';
import { fetchAdminJobs } from '../../services/admin.service.js';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { Card, CardContent } from '../ui/Card.jsx';
import { StatusBadge } from '../StatusBadge.jsx';
import { Clapperboard } from 'lucide-react';

export function JobsTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'jobs'],
    queryFn: fetchAdminJobs,
  });

  if (isLoading) return <LoadingState label="Loading jobs…" />;
  if (isError) return <ErrorState onRetry={refetch} description="Could not load jobs." />;
  if (!data?.length) return <EmptyState icon={Clapperboard} title="No jobs" description="No generation jobs found." />;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {data.map((job) => (
            <div key={job._id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{job.prompt || job.type}</p>
                <p className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleString()}</p>
              </div>
              <StatusBadge status={job.status} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
