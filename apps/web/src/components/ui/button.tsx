'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary: 'bg-accent text-accent-ink font-semibold hover:brightness-110',
  secondary: 'bg-surface-2 text-ink border border-line hover:border-accent/60',
  ghost: 'text-dim hover:text-ink hover:bg-surface-2',
};

export function Button({ variant = 'primary', className, ...props }: HTMLMotionProps<'button'> & { variant?: Variant }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={cn('inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm transition-colors disabled:opacity-50', styles[variant], className)}
      {...props}
    />
  );
}
