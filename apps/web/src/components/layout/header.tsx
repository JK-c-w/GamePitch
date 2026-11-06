'use client';

import { Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/providers/theme-provider';

export function Header({ online = 1284 }: { online?: number }) {
  const { theme, toggle } = useTheme();
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <Link href="/" className="font-display text-2xl font-bold tracking-tight">GamePitch</Link>
      <div className="flex items-center gap-3">
        <span className="hidden items-center gap-2 text-sm text-dim sm:flex">
          <span className="size-2 animate-pulse rounded-full bg-ok" />
          <span className="tabular">{online.toLocaleString()}</span> playing now
        </span>
        <Button variant="ghost" className="h-10 px-3" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
      </div>
    </header>
  );
}
