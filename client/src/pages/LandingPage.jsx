import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, Shield, CircuitBoard, Wand2, ImageIcon, Play } from 'lucide-react';
import { buttonVariants } from '../components/ui/Button.jsx';
import { cn } from '../lib/utils.js';
import { BrightBotsLogo, BrightBotsIcon } from '../components/brand/BrightBotsLogo.jsx';

const FEATURES = [
  {
    icon: Wand2,
    title: 'Text to Video',
    description: 'Describe any scene and watch it come alive with AI-generated video.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: ImageIcon,
    title: 'Image to Video',
    description: 'Transform static images into dynamic, animated video sequences.',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Play,
    title: 'Text + Image',
    description: 'Combine text prompts with reference images for precise creative control.',
    color: 'text-highlight',
    bg: 'bg-highlight/10',
  },
];

const TECH_FEATURES = [
  { icon: Cpu, label: 'Wan 2.2 AI Model' },
  { icon: Zap, label: 'Fast Generation' },
  { icon: Shield, label: 'Secure Platform' },
  { icon: CircuitBoard, label: 'Cloud Processing' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav bar */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <BrightBotsLogo size="sm" />
          <div className="flex items-center gap-3">
            <Link to="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
              Sign In
            </Link>
            <Link to="/register" className={cn(buttonVariants({ size: 'sm' }))}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-tech-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-background" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <BrightBotsIcon size={18} />
              Powered by BrightBots Edutech
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Create Stunning Videos
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
                With AI
              </span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Transform your ideas into cinematic videos using state-of-the-art
              Wan 2.2 AI models. No GPU required — everything runs in the cloud.
            </p>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className={cn(buttonVariants({ size: 'lg' }), 'group')}
              >
                Start Creating Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/login"
                className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
              >
                Sign In
              </Link>
            </div>

            {/* Tech badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {TECH_FEATURES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  {label}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Three Ways to Create
            </h2>
            <p className="text-muted-foreground mt-2">
              Choose the generation mode that fits your creative vision
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 space-y-4 card-glow hover:border-primary/20 transition-all duration-200"
              >
                <div className={cn('inline-flex items-center justify-center h-10 w-10 rounded-lg', bg)}>
                  <Icon className={cn('h-5 w-5', color)} />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Technology Section */}
      <section className="border-t border-border bg-card/30">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Built on Cutting-Edge AI
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                NovaFrame uses the Wan 2.2 video generation model through Replicate&apos;s
                cloud infrastructure. Generate professional-quality videos without
                requiring expensive GPU hardware.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {['Replicate', 'Cloud GPU', 'Wan 2.2', '720p HD'].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 font-mono text-sm space-y-2">
              <div className="text-muted-foreground">// Describe your video</div>
              <div className="text-foreground">{'prompt: "A futuristic city at sunset"'}</div>
              <div className="text-foreground">{'mode: "text-to-video"'}</div>
              <div className="text-foreground">{'model: "Wan 2.2"'}</div>
              <div className="text-foreground">{'duration: 5 {'}</div>
              <div className="text-muted-foreground pl-4">// AI generates your video</div>
              <div className="text-foreground">{'}'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <BrightBotsLogo size="sm" />
            <span className="text-sm text-muted-foreground">AI Video Generation Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
