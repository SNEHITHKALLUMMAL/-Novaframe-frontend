import { useQuery } from '@tanstack/react-query';
import { fetchAdminUsers } from '../../services/admin.service.js';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { Card, CardContent } from '../ui/Card.jsx';
import { StatusBadge } from '../StatusBadge.jsx';
import { Users } from 'lucide-react';

export function UsersTab() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchAdminUsers,
  });

  if (isLoading) return <LoadingState label="Loading users…" />;
  if (isError) return <ErrorState onRetry={refetch} description="Could not load users." />;
  if (!data?.length) return <EmptyState icon={Users} title="No users" description="No users found." />;

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {data.map((user) => (
            <div key={user._id} className="flex items-center justify-between px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <StatusBadge status={user.role} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
