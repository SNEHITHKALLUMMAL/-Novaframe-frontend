import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines conditional class names (clsx) and resolves Tailwind class
 * conflicts (tailwind-merge) — e.g. cn('px-2', condition && 'px-4') correctly
 * keeps only 'px-4' instead of emitting both. Used by every UI primitive.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
