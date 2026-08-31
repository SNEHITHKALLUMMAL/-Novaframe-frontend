import { LogOut, User, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { Button } from './ui/Button.jsx';

export function Topbar() {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 md:px-6 py-3">
      <div className="lg:hidden flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">NovaFrame</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{user?.name ?? user?.email}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
