import { cn } from '@/lib/cn';

export function formatClock(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSeconds = ms / 1000;
  if (totalSeconds < 10) return totalSeconds.toFixed(1);
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Brass when it is this side's turn, coral when under 30 seconds. */
export function Clock({ ms, active }: { ms: number; active: boolean }) {
  const low = ms < 30_000;
  return (
    <div
      role="timer"
      aria-live="off"
      className={cn(
        'tabular min-w-24 rounded-lg border px-4 py-1.5 text-center text-2xl font-semibold transition-colors duration-200',
        active ? (low ? 'border-transparent bg-danger text-white' : 'border-transparent bg-accent text-accent-ink') : low ? 'border-line bg-surface text-danger' : 'border-line bg-surface text-ink',
      )}
    >
      {formatClock(ms)}
    </div>
  );
}
