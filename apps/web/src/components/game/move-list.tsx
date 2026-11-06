'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';

/** Moves in standard algebraic notation, two plies per row. */
export function MoveList({ moves }: { moves: string[] }) {
  const endRef = useRef<HTMLDivElement>(null);
useEffect(() => {
  endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}, [moves.length]);

  if (moves.length === 0) return <p className="px-4 py-6 text-sm text-dim">No moves yet. White starts.</p>;

  const rows: { n: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) rows.push({ n: i / 2 + 1, white: moves[i]!, black: moves[i + 1] });

  return (
    <ol className="tabular max-h-64 overflow-y-auto px-2 py-2 text-sm lg:max-h-80">
      {rows.map((r, idx) => {
        const lastIdx = moves.length - 1;
        return (
          <li key={r.n} className={cn('grid grid-cols-[2.5rem_1fr_1fr] rounded-md px-2 py-1', idx % 2 === 1 && 'bg-surface-2')}>
            <span className="text-dim">{r.n}.</span>
            <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={cn(lastIdx === idx * 2 && 'font-semibold text-accent')}>{r.white}</motion.span>
            {r.black !== undefined && (
              <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={cn(lastIdx === idx * 2 + 1 && 'font-semibold text-accent')}>{r.black}</motion.span>
            )}
          </li>
        );
      })}
      <div ref={endRef} />
    </ol>
  );
}
