import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm space-y-6"
      >
        <Link to="/" className="block text-center text-lg font-semibold text-foreground">
          AI Video Platform
        </Link>
        <Outlet />
      </motion.div>
    </div>
  );
}
