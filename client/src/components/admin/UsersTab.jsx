import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { fetchAdminUsers, setUserRole, setUserActive } from '../../services/admin.service.js';
import { useAuth } from '../../hooks/useAuth.js';
import { Input } from '../ui/Input.jsx';
import { Select } from '../ui/Select.jsx';
import { Button } from '../ui/Button.jsx';
import { LoadingState } from '../ui/LoadingState.jsx';
import { ErrorState } from '../ui/ErrorState.jsx';
import { EmptyState } from '../ui/EmptyState.jsx';
import { useToast } from '../ui/toast/ToastContext.jsx';
import { parseApiError } from '../../lib/apiError.js';

export function UsersTab() {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', { search, page }],
    queryFn: () => fetchAdminUsers({ search: search || undefined, page }),
    placeholderData: (prev) => prev,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => setUserRole(id, role),
    onSuccess: () => {
      invalidate();
      toast({ title: 'Role updated' });
    },
    onError: (err) => toast({ title: 'Could not update role', description: parseApiError(err).message, variant: 'destructive' }),
  });

  const activeMutation = useMutation({
    mutationFn: ({ id, isActive }) => setUserActive(id, isActive),
    onSuccess: () => {
      invalidate();
      toast({ title: 'User status updated' });
    },
    onError: (err) => toast({ title: 'Could not update status', description: parseApiError(err).message, variant: 'destructive' }),
  });

  if (usersQuery.isLoading) return <LoadingState label="Loading users…" />;
  if (usersQuery.isError) return <ErrorState onRetry={usersQuery.refetch} description="Couldn't load users." />;

  const { users, total, limit } = usersQuery.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email..."
          className="pl-9"
        />
      </div>

      {users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different search." />
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-2">Name</th>
                <th className="text-left font-medium px-4 py-2">Email</th>
                <th className="text-left font-medium px-4 py-2">Role</th>
                <th className="text-left font-medium px-4 py-2">Status</th>
                <th className="text-left font-medium px-4 py-2">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="px-4 py-2.5 text-foreground">{u.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <Select
                      aria-label={`Change role for ${u.name}`}
                      value={u.role}
                      disabled={u._id === currentUser?._id}
                      onChange={(e) => roleMutation.mutate({ id: u._id, role: e.target.value })}
                      className="h-8 w-28 text-xs"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </td>
                  <td className="px-4 py-2.5">
                    <Button
                      size="sm"
                      variant={u.isActive ? 'outline' : 'destructive'}
                      disabled={u._id === currentUser?._id}
                      isLoading={activeMutation.isPending && activeMutation.variables?.id === u._id}
                      onClick={() => activeMutation.mutate({ id: u._id, isActive: !u.isActive })}
                    >
                      {u.isActive ? 'Active' : 'Deactivated'}
                    </Button>
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {new Date(u.createdAt).toLocaleDateString()}
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
