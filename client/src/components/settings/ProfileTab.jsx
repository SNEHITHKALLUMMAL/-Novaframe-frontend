import { useAuth } from '../../hooks/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';

export function ProfileTab() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="text-sm text-foreground">{user?.name ?? '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="text-sm text-foreground">{user?.email ?? '—'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Role</p>
          <p className="text-sm text-foreground capitalize">{user?.role ?? 'user'}</p>
        </div>
      </CardContent>
    </Card>
  );
}
