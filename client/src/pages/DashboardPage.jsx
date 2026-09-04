import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Clapperboard, ListVideo, Loader2, Sparkles, XCircle, ArrowRight, Video, Cpu } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome hero */}
      <div className="rounded-xl border border-border bg-gradient-to-r from-primary/5 via-card to-accent/5 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Welcome back, {user?.name}
            </h1>
            <p className="text-muted-foreground">
              Your AI video creation dashboard. Let&apos;s make something amazing.
            </p>
          </div>
          <Link to="/generate" className={cn(buttonVariants(), 'group shrink-0')}>
            <Sparkles className="h-4 w-4" />
            Create Video
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {isLoading && <LoadingState label="Loading your dashboard…" />}
      {isError && <ErrorState onRetry={refetch} description="Couldn't load your dashboard data." />}

      {data && (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total generations" value={data.totalJobs} icon={Clapperboard} color="primary" />
            <StatCard label="Videos in library" value={data.totalVideos} icon={ListVideo} color="accent" />
            <StatCard
              label="In progress"
              value={data.statusCounts.PROCESSING + data.statusCounts.QUEUED + data.statusCounts.PENDING}
              icon={Loader2}
              color="info"
            />
            <StatCard label="Failed" value={data.statusCounts.FAILED} icon={XCircle} color="destructive" />
          </div>

          {/* Recent generations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                Recent Generations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentJobs.length === 0 ? (
                <EmptyState
                  icon={Clapperboard}
                  title="No generations yet"
                  description="Your generation history will show up here once you create your first video."
                  actionLabel="Create your first video"
                  onAction={() => window.location.href = '/generate'}
                />
              ) : (
                <div className="space-y-2">
                  {data.recentJobs.map((job) => (
                    <div
                      key={job._id}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 px-4 py-3 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {job.prompt || job.type}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
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

          {/* Recent videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-accent" />
                Recent Videos
              </CardTitle>
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
                      className="group rounded-lg overflow-hidden border border-border bg-secondary aspect-video relative card-glow"
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
