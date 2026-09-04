import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, CircuitBoard, Video } from 'lucide-react';
import { BrightBotsLogo, BrightBotsIcon } from '../components/brand/BrightBotsLogo.jsx';

export function AuthLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding panel — visible on larger screens */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 border-r border-border">
        <div className="absolute inset-0 pattern-circuit" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Logo with tagline */}
            <BrightBotsLogo size="lg" showTagline />

            {/* Tagline */}
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              AI Video Generation
              <br />
              <span className="text-primary">Platform</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              Create stunning videos with cutting-edge AI models.
              Powered by Wan 2.2 through Replicate.
            </p>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { icon: Sparkles, label: 'Text to Video', desc: 'Describe your scene' },
                { icon: Cpu, label: 'Wan 2.2 AI', desc: 'State-of-the-art model' },
                { icon: CircuitBoard, label: 'Smart Pipeline', desc: 'Automated workflow' },
                { icon: Video, label: 'HD Output', desc: 'Cloud storage' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="rounded-lg border border-border bg-card/50 p-3 space-y-1">
                  <Icon className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium text-foreground">{label}</p>
                  <p className="text-[11px] text-muted-foreground">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right auth form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo (hidden on lg+) */}
          <Link to="/" className="lg:hidden block mb-8 text-center">
            <div className="inline-flex flex-col items-center gap-2">
              <BrightBotsIcon size={48} />
              <div>
                <span className="font-bold text-foreground text-lg tracking-tight">
                  Bright<span className="text-primary">Bots</span>
                </span>
                <p className="text-[10px] text-muted-foreground">Edutech & Robotics</p>
              </div>
            </div>
          </Link>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
