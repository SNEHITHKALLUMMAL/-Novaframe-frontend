import { Link } from 'react-router-dom';
import { buttonVariants } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-4">
      <p className="text-sm font-medium text-primary">404</p>
      <h1 className="text-2xl font-semibold text-foreground">Page not found</h1>
      <p className="text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to="/" className={cn(buttonVariants())}>
        Back home
      </Link>
    </main>
  );
}
