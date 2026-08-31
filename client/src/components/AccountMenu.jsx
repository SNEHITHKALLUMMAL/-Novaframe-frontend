import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export function AccountMenu() {
  const { user, logout, isLoggingOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1.5 hover:bg-accent text-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-primary">
          <User className="h-4 w-4" />
        </span>
        <span className="hidden sm:inline text-foreground font-medium">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border border-border bg-card shadow-lg py-1 z-50">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive-text hover:bg-accent disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
