import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clapperboard, FolderKanban, Settings, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useAuth } from '../hooks/useAuth.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Generate', icon: Sparkles },
  { to: '/library', label: 'Video Library', icon: Clapperboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();
  const items = user?.role === 'admin'
    ? [...navItems, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : navItems;

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col border-r border-border bg-card">
      <div className="h-16 flex items-center px-6 font-semibold text-foreground">
        AI Video Platform
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
