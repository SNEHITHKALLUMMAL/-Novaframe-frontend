import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminSubscriptions } from '../../services/admin.service.js';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';

export function SubscriptionsTab() {
  const [plan, setPlan] = useState('');
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['admin', 'subscriptions', { plan, page }],
    queryFn: () => fetchAdminSubscriptions({ plan: plan || undefined, page }),
    placeholderData: (prev) => prev,
  });

  if (query.isLoading) return <LoadingState label="Loading subscriptions…" />;
  if (query.isError) return <ErrorState onRetry={query.refetch} description="Couldn't load subscriptions." />;

  const { subscriptions, total, limit } = query.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <Select aria-label="Filter by plan" value={plan} onChange={(e) => { setPlan(e.target.value); setPage(1); }} className="w-auto">
        <option value="">All plans</option>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="unlimited">Unlimited</option>
      </Select>

      {subscriptions.length === 0 ? (
        <EmptyState title="No subscriptions found" description="Try a different filter." />
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2">User</th>
                <th className="text-left font-medium px-4 py-2">Plan</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Renews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((sub) => (
                <tr key={sub._id}>
                  <td className="px-4 py-2.5 text-foreground">{sub.user?.name ?? 'Unknown'}</td>
                  <td className="px-4 py-2.5 text-muted-foreground capitalize">{sub.plan}</td>
                  <td className="px-4 py-2.5 text-muted-foreground capitalize">
                    {sub.status}
                    {sub.cancelAtPeriodEnd && ' (cancelling)'}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : '—'}
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
