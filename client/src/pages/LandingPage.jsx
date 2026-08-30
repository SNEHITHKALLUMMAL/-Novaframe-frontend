import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { buttonVariants } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';

/**
 * Phase 6 scope: a real, working landing shell (hero + primary CTA) that
 * proves the design system and routing work end to end. The full
 * multi-section landing page content described in the SRS (How It Works,
 * Features, AI Models, Example Videos, Pricing, FAQ, Security, Footer) is
 * genuine content-authoring work, not infrastructure — it's built out
 * once there's an actual product (generation modes, pricing tiers) to
 * describe truthfully, rather than shipped now with placeholder copy.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl space-y-6"
      >
        <div className="mx-auto w-fit rounded-full bg-primary/10 p-3">
          <Sparkles className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
          Create Stunning Videos With AI
        </h1>
        <p className="text-muted-foreground text-lg">
          Text → Video · Image → Video · Text + Image → Video
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to="/register" className={cn(buttonVariants({ size: 'lg' }))}>
            Start Creating
          </Link>
          <Link to="/login" className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}>
            Log In
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
