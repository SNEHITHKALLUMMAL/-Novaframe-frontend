import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Sparkles, FolderKanban, ListVideo, Settings, Shield, Cpu } from 'lucide-react';
import { cn } from '../lib/utils.js';
import { useAuth } from '../hooks/useAuth.js';
import { BrightBotsLogo } from './brand/BrightBotsLogo.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Create Video', icon: Sparkles },
  { to: '/library', label: 'My Videos', icon: ListVideo },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center px-5 py-5 border-b border-border">
        <BrightBotsLogo size="default" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-highlight/10 text-highlight'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              )
            }
          >
            <Shield className="h-4 w-4 shrink-0" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Bottom branding */}
      <div className="px-5 py-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Cpu className="h-3 w-3" />
          <span>AI Video Platform</span>
        </div>
      </div>
    </aside>
  );
}
