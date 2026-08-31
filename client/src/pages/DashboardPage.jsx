import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clapperboard, ListVideo, Loader2, Sparkles, XCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { fetchDashboardSummary } from '../services/dashboard.service.js';
import { StatCard } from '../components/StatCard.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { LoadingState } from '../components/ui/LoadingState.jsx';
import { ErrorState } from '../components/ui/ErrorState.jsx';
import { EmptyState } from '../components/ui/EmptyState.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { buttonVariants } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: fetchDashboardSummary,
  });

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground">Here's what's happening with your generations.</p>
        </div>
        <Link to="/generate" className={cn(buttonVariants())}>
          <Sparkles className="h-4 w-4" />
          New generation
        </Link>
      </div>

      {isLoading && <LoadingState label="Loading your dashboard…" />}
      {isError && <ErrorState onRetry={refetch} description="Couldn't load your dashboard data." />}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total generations" value={data.totalJobs} icon={Clapperboard} />
            <StatCard label="Videos in library" value={data.totalVideos} icon={ListVideo} />
            <StatCard
              label="In progress"
              value={data.statusCounts.PROCESSING + data.statusCounts.QUEUED + data.statusCounts.PENDING}
              icon={Loader2}
            />
            <StatCard label="Failed" value={data.statusCounts.FAILED} icon={XCircle} />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent generations</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentJobs.length === 0 ? (
                <EmptyState
                  icon={Clapperboard}
                  title="No generations yet"
                  description="Your generation history will show up here once you create your first video."
                />
              ) : (
                <div className="divide-y divide-border">
                  {data.recentJobs.map((job) => (
                    <div key={job._id} className="flex items-center justify-between py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {job.prompt || job.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.aiModel?.name ?? 'Unknown model'} ·{' '}
                          {new Date(job.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <StatusBadge status={job.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent videos</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentVideos.length === 0 ? (
                <EmptyState
                  icon={ListVideo}
                  title="No videos yet"
                  description="Completed generations will appear here as videos you can preview and download."
                />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {data.recentVideos.map((video) => (
                    <Link
                      key={video._id}
                      to="/library"
                      className="group rounded-md overflow-hidden border border-border bg-secondary aspect-video relative"
                    >
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Clapperboard className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <span className="absolute bottom-1 left-1">
                        <StatusBadge status={video.status} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
