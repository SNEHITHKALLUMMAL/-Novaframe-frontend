import { useAuth } from '../../hooks/useAuth.js';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { User, Mail, Shield } from 'lucide-react';

export function ProfileTab() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/30 p-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/15 text-primary text-sm font-bold">
            {(user?.name ?? user?.email ?? '?')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{user?.name ?? '—'}</p>
            <p className="text-xs text-muted-foreground">{user?.email ?? '—'}</p>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Name</p>
              <p className="text-sm text-foreground">{user?.name ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Email</p>
              <p className="text-sm text-foreground">{user?.email ?? '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-3">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Role</p>
              <p className="text-sm text-foreground capitalize">{user?.role ?? 'user'}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
