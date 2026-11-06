'use client';

import { motion } from 'framer-motion';
import { mockProfile as p } from '@/lib/mock-data';

export function ProfileStrip() {
  const winRate = Math.round((p.wins / p.games) * 100);
  const stats = [
    { value: p.rating, label: 'Rating' },
    { value: p.games, label: 'Games played' },
    { value: `${p.wins} / ${p.losses} / ${p.draws}`, label: 'Wins, losses, draws' },
    { value: `${winRate}%`, label: 'Win rate' },
  ];
  return (
    <section className="flex flex-wrap items-end gap-x-10 gap-y-6 border-b border-line pb-8 pt-4">
      <div className="mr-auto flex items-center gap-4">
        <div className="grid size-14 place-items-center rounded-full bg-linear-to-br from-accent to-[#6b8fb0] text-xl font-bold text-[#10131c]">G</div>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">{p.username}</h1>
          <p className="text-sm text-dim">Sign in to keep your rating and history</p>
        </div>
      </div>
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          <p className="tabular font-display text-3xl font-semibold">{s.value}</p>
          <p className="text-sm text-dim">{s.label}</p>
        </motion.div>
      ))}
    </section>
  );
}
