import { LogOut, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useState } from 'react';
import { BrightBotsIcon } from './brand/BrightBotsLogo.jsx';

export function Topbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 md:px-6 py-3">
      {/* Mobile logo */}
      <div className="lg:hidden flex items-center gap-2">
        <BrightBotsIcon size={26} />
        <span className="font-bold text-foreground text-sm tracking-tight">
          Bright<span className="text-primary">Bots</span>
        </span>
      </div>

      <div className="flex-1" />

      {/* User menu */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-1.5 text-sm text-foreground hover:bg-secondary transition-colors"
          >
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/15 text-primary text-xs font-semibold">
              {(user?.name ?? user?.email ?? '?')[0].toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium max-w-[120px] truncate">
              {user?.name ?? user?.email}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border bg-card shadow-lg z-20 py-1 animate-scale-in">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
                  onClick={() => { window.location.href = '/settings'; setMenuOpen(false); }}
                >
                  <User className="h-4 w-4" />
                  Account Settings
                </button>
                <button
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive-text hover:bg-destructive/10 transition-colors"
                  onClick={() => { logout(); setMenuOpen(false); }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
