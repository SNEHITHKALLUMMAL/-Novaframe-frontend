import { useQuery } from '@tanstack/react-query';
import { Users, Clapperboard, ListVideo, DollarSign } from 'lucide-react';
import { fetchAdminOverview } from '../../services/admin.service.js';
import { StatCard } from '../StatCard.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';

function formatCents(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function OverviewTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: fetchAdminOverview,
  });

  if (isLoading) return <LoadingState label="Loading platform overview…" />;
  if (isError) return <ErrorState onRetry={refetch} description="Couldn't load overview stats." />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total users" value={data.totalUsers} icon={Users} />
        <StatCard label="Active users" value={data.activeUsers} icon={Users} />
        <StatCard label="Total generations" value={data.totalJobs} icon={Clapperboard} />
        <StatCard label="Videos" value={data.totalVideos} icon={ListVideo} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Jobs by status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.jobsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{status.toLowerCase()}</span>
                <span className="text-foreground font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscriptions by plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(data.subscriptionsByPlan).length === 0 && (
              <p className="text-sm text-muted-foreground">No subscriptions yet.</p>
            )}
            {Object.entries(data.subscriptionsByPlan).map(([plan, count]) => (
              <div key={plan} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{plan}</span>
                <span className="text-foreground font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total revenue</p>
              <p className="text-2xl font-semibold text-foreground mt-1">
                {formatCents(data.totalRevenueCents)}
              </p>
            </div>
            <div className="rounded-full bg-primary/10 p-2.5">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {Object.entries(data.queue).map(([state, count]) => (
              <div key={state} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground capitalize">{state}</span>
                <span className="text-foreground font-medium">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
