'use client';

import { motion } from 'framer-motion';
import type { Color } from '@chess/shared';
import type { GameResult } from '@/hooks/use-local-game';
import { Button } from '@/components/ui/button';

const REASON: Record<GameResult['kind'], string> = {
  checkmate: 'Checkmate',
  resignation: 'Resignation',
  timeout: 'Out of time',
  stalemate: 'Stalemate',
  repetition: 'Threefold repetition',
  fifty_move: 'Fifty-move rule',
  insufficient_material: 'Insufficient material',
  draw_agreement: 'Draw agreed',
  abandonment: 'Abandoned',
};

export function ResultBanner({ result, playerColor, onNewGame }: { result: GameResult; playerColor: Color; onNewGame: () => void }) {
  const title = result.winner === null ? 'Draw' : result.winner === playerColor ? 'You won' : 'You lost';
  return (
    <motion.div
      className="absolute inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-[3px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <motion.div
        className="mx-4 rounded-2xl border border-line bg-surface px-8 py-7 text-center shadow-2xl"
        initial={{ scale: 0.92, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.1 }}
      >
        <h2 className="font-display text-4xl font-bold tracking-tight">{title}</h2>
        <p className="mb-5 mt-1 text-dim">{REASON[result.kind]}</p>
        <Button onClick={onNewGame}>New game</Button>
      </motion.div>
    </motion.div>
  );
}
