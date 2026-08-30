import { AnimatePresence, motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Clapperboard, FolderKanban, Settings, Sparkles, ShieldCheck, X } from 'lucide-react';
import { toggleSidebar } from '../store/slices/uiSlice.js';
import { cn } from '../lib/utils.js';
import { useAuth } from '../hooks/useAuth.js';
import { isAdminRole } from '../lib/roles.js';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/generate', label: 'Generate', icon: Sparkles },
  { to: '/library', label: 'Video Library', icon: Clapperboard },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function MobileSidebarDrawer() {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);
  const { user } = useAuth();
  const close = () => dispatch(toggleSidebar());
  const items = isAdminRole(user?.role)
    ? [...navItems, { to: '/admin', label: 'Admin', icon: ShieldCheck }]
    : navItems;

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.2 }}
            className="absolute inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-4">
              <span className="font-semibold text-foreground">AI Video Platform</span>
              <button onClick={close} aria-label="Close menu" className="text-muted-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {items.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={close}
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
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
