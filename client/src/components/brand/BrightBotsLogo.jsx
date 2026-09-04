import { cn } from '../../lib/utils.js';

/**
 * BrightBots Edutech & Robotics logo — full lockup (icon + wordmark).
 * Designed to feel like a technology-education brand: a friendly robot head
 * with a glowing antenna, paired with clean "BrightBots" wordmark and
 * optional "Edutech & Robotics" tagline.
 */
export function BrightBotsLogo({ className, size = 'default', showTagline = false }) {
  const sizes = {
    sm: { icon: 28, text: 'text-base', tagline: 'text-[9px]', gap: 'gap-2' },
    default: { icon: 34, text: 'text-lg', tagline: 'text-[10px]', gap: 'gap-2.5' },
    lg: { icon: 42, text: 'text-xl', tagline: 'text-xs', gap: 'gap-3' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className={cn('flex items-center', s.gap, className)}>
      <BrightBotsIcon size={s.icon} />
      <div className="flex flex-col">
        <span className={cn('font-bold text-foreground leading-none tracking-tight', s.text)}>
          Bright<span className="text-primary">Bots</span>
        </span>
        {showTagline && (
          <span className={cn('text-muted-foreground leading-none mt-0.5', s.tagline)}>
            Edutech & Robotics
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Compact wordmark-only (no icon). Useful in tight spaces.
 */
export function BrightBotsWordmark({ className, size = 'default' }) {
  const sizes = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  return (
    <span className={cn('font-bold text-foreground tracking-tight', sizes[size] || sizes.default, className)}>
      Bright<span className="text-primary">Bots</span>
    </span>
  );
}

/**
 * BrightBots robot icon — a friendly bot head with a glowing antenna.
 * The icon works at any size via the `size` prop (px).
 */
export function BrightBotsIcon({ size = 34, className }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      aria-label="BrightBots logo"
    >
      {/* Glow behind antenna */}
      <circle cx="20" cy="5" r="4" fill="url(#bb-glow)" opacity="0.6" />

      {/* Antenna stem */}
      <line x1="20" y1="9" x2="20" y2="14" stroke="hsl(199, 89%, 48%)" strokeWidth="2" strokeLinecap="round" />

      {/* Robot head — rounded rectangle */}
      <rect x="8" y="14" width="24" height="20" rx="6" fill="hsl(220, 20%, 12%)" stroke="hsl(199, 89%, 48%)" strokeWidth="1.5" />

      {/* Eyes */}
      <circle cx="15" cy="23" r="2.5" fill="hsl(199, 89%, 48%)" />
      <circle cx="25" cy="23" r="2.5" fill="hsl(199, 89%, 48%)" />

      {/* Eye highlights */}
      <circle cx="14" cy="22" r="0.8" fill="white" opacity="0.9" />
      <circle cx="24" cy="22" r="0.8" fill="white" opacity="0.9" />

      {/* Mouth — friendly smile */}
      <path d="M15 28 Q20 31 25 28" stroke="hsl(199, 89%, 48%)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Ear accents */}
      <rect x="4" y="20" width="4" height="6" rx="2" fill="hsl(199, 89%, 48%)" opacity="0.4" />
      <rect x="32" y="20" width="4" height="6" rx="2" fill="hsl(199, 89%, 48%)" opacity="0.4" />

      {/* Antenna dot */}
      <circle cx="20" cy="5" r="2.5" fill="hsl(199, 89%, 48%)" />

      <defs>
        <radialGradient id="bb-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="hsl(199, 89%, 48%)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(199, 89%, 48%)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
