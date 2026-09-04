import { useQuery } from '@tanstack/react-query';
import { Users, Clapperboard, Cpu } from 'lucide-react';
import { fetchAdminOverview } from '../../services/admin.service.js';
import { StatCard } from '../StatCard.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';

export function OverviewTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'overview'],
    queryFn: fetchAdminOverview,
  });

  if (isLoading) return <LoadingState label="Loading overview…" />;
  if (isError) return <ErrorState onRetry={refetch} description="Could not load admin overview." />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard label="Total users" value={data?.totalUsers} icon={Users} />
      <StatCard label="Total jobs" value={data?.totalJobs} icon={Clapperboard} />
      <StatCard label="Active models" value={data?.activeModels} icon={Cpu} />
    </div>
  );
}
