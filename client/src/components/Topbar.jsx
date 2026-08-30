import { useDispatch } from 'react-redux';
import { Menu } from 'lucide-react';
import { toggleSidebar } from '../store/slices/uiSlice.js';
import { AccountMenu } from './AccountMenu.jsx';

export function Topbar() {
  const dispatch = useDispatch();

  return (
    <header className="h-16 border-b border-border bg-background flex items-center px-4 md:px-6 gap-4">
      <button
        onClick={() => dispatch(toggleSidebar())}
        aria-label="Toggle menu"
        className="md:hidden text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1" />
      <AccountMenu />
    </header>
  );
}
