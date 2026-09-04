import { Link } from 'react-router-dom';
import { buttonVariants } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';
import { ArrowLeft } from 'lucide-react';
import { BrightBotsIcon } from '../components/brand/BrightBotsLogo.jsx';

export default function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6 bg-tech-grid">
      <BrightBotsIcon size={56} />
      <div className="space-y-2">
        <p className="text-sm font-bold text-primary tracking-wider uppercase">404</p>
        <h1 className="text-3xl font-bold text-foreground">Page not found</h1>
        <p className="text-muted-foreground max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link to="/" className={cn(buttonVariants(), 'group')}>
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to home
      </Link>
    </main>
  );
}
