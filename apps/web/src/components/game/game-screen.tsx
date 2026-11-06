'use client';

import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { Flag, FlipVertical, Handshake, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import type { TimeControl } from '@chess/shared';
import { Board } from '@/components/board/board';
import { Button } from '@/components/ui/button';
import { useLocalGame } from '@/hooks/use-local-game';
import { cn } from '@/lib/cn';
import type { Orientation, PieceType, Square } from '@/lib/chess/pieces';
import { MoveList } from './move-list';
import { PlayerBar } from './player-bar';
import { ResultBanner } from './result-banner';

const PRESETS: { label: string; kind: string; tc: TimeControl }[] = [
  { label: '1+0', kind: 'Bullet', tc: { initialSeconds: 60, incrementSeconds: 0 } },
  { label: '3+2', kind: 'Blitz', tc: { initialSeconds: 180, incrementSeconds: 2 } },
  { label: '5+0', kind: 'Blitz', tc: { initialSeconds: 300, incrementSeconds: 0 } },
  { label: '10+0', kind: 'Rapid', tc: { initialSeconds: 600, incrementSeconds: 0 } },
  { label: '15+10', kind: 'Rapid', tc: { initialSeconds: 900, incrementSeconds: 10 } },
];

export function GameScreen() {
  const [presetIdx, setPresetIdx] = useState(2);
  const [gameNo, setGameNo] = useState(0);
  const preset = PRESETS[presetIdx]!;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-6">
      <div className="mb-3 flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Time control">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            role="radio"
            aria-checked={i === presetIdx}
            onClick={() => { setPresetIdx(i); setGameNo((n) => n + 1); }}
            className={cn('relative h-9 rounded-lg px-3 text-sm transition-colors', i === presetIdx ? 'text-accent-ink' : 'text-dim hover:text-ink')}
          >
            {i === presetIdx && <motion.span layoutId="tc-pill" className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 500, damping: 36 }} />}
            <span className="relative font-semibold">{p.label}</span> <span className="relative hidden text-xs opacity-75 sm:inline">{p.kind}</span>
          </button>
        ))}
      </div>
      <GameSession key={`${presetIdx}-${gameNo}`} timeControl={preset.tc} onNewGame={() => setGameNo((n) => n + 1)} />
    </main>
  );
}

function GameSession({ timeControl, onNewGame }: { timeControl: TimeControl; onNewGame: () => void }) {
  const playerColor = 'w' as const;
  const game = useLocalGame({ timeControl, botColor: 'b' });
  const [orientation, setOrientation] = useState<Orientation>('white');
  const [selected, setSelected] = useState<Square | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{ from: Square; to: Square } | null>(null);

  const myTurn = !game.result && game.turn === playerColor;
  const targets = selected ? game.legalMovesFrom(selected) : [];

  /** Plays from->to if legal. Promotions open the picker first and report "not played yet". */
  const attemptMove = (from: Square, to: Square): boolean => {
    if (!myTurn) return false;
    const target = game.legalMovesFrom(from).find((t) => t.to === to);
    if (!target) return false;
    setSelected(null);
    if (target.promotion) {
      setPendingPromotion({ from, to });
      return false;
    }
    return game.makeMove(from, to);
  };

  const handleSquare = (square: Square) => {
    if (!myTurn || pendingPromotion) return;
    if (selected && targets.some((t) => t.to === square)) {
      attemptMove(selected, square);
      return;
    }
    const piece = game.pieces.find((p) => p.square === square);
    setSelected(piece && piece.color === playerColor && square !== selected ? square : null);
  };

  const topColor = orientation === 'white' ? 'b' : 'w';
  const bottomColor = topColor === 'w' ? 'b' : 'w';
  const lead = (side: 'w' | 'b') => {
    const sum = (arr: PieceType[]) => arr.reduce((n, t) => n + ({ p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }[t]), 0);
    const diff = sum(game.captured.byWhite) - sum(game.captured.byBlack);
    return side === 'w' ? Math.max(0, diff) : Math.max(0, -diff);
  };
  const bar = (side: 'w' | 'b') => ({
    name: side === playerColor ? 'You' : 'JK',
    rating: side === playerColor ? 1642 : 1580,
    initial: side === playerColor ? 'Y' : 'N',
    captured: side === 'w' ? game.captured.byWhite : game.captured.byBlack,
    capturedColor: (side === 'w' ? 'b' : 'w') as 'w' | 'b',
    lead: lead(side),
    clockMs: game.clock[side],
    clockActive: !game.result && game.history.length >= 2 && game.turn === side,
  });

  const status = game.result ? 'Game over' : game.turn === playerColor ? 'Your move' : 'JK is thinking';
   
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="mx-auto w-full max-w-[min(100%,calc(100dvh-14rem))]">
        <PlayerBar {...bar(topColor)} />
        <Board
          pieces={game.pieces}
          orientation={orientation}
          selected={selected}
          targets={targets}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          canMovePiece={(p) => myTurn && !pendingPromotion && p.color === playerColor}
          onSquareClick={handleSquare}
          onDragBegin={(sq) => setSelected(sq)}
          onDrop={attemptMove}
          promotion={pendingPromotion ? { color: playerColor } : null}
          onPromote={(piece) => {
            if (!pendingPromotion) return;
            game.makeMove(pendingPromotion.from, pendingPromotion.to, piece);
            setPendingPromotion(null);
          }}
          onCancelPromotion={() => setPendingPromotion(null)}
        >
          <AnimatePresence>{game.result && <ResultBanner result={game.result} playerColor="white" onNewGame={onNewGame} />}</AnimatePresence>
        </Board>
        <PlayerBar {...bar(bottomColor)} />
      </div>

      <aside className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h2 className="font-semibold">Moves</h2>
          <span className="text-xs text-dim" aria-live="polite">{status}</span>
        </div>
        <MoveList moves={game.history.map((m) => m.san)} />
        <div className="flex flex-wrap gap-2 border-t border-line p-3">
          <Button variant="secondary" className="h-10 flex-1 px-3" onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}>
            <FlipVertical size={16} /> Flip
          </Button>
          <Button variant="secondary" className="h-10 flex-1 px-3" disabled={Boolean(game.result)} onClick={() => game.resign(playerColor)}>
            <Flag size={16} /> Resign
          </Button>
          <Button variant="secondary" className="h-10 flex-1 px-3" disabled title="Draw offers arrive with online play" >
            <Handshake size={16} /> Draw
          </Button>
          <Button variant="ghost" className="h-10 w-full" onClick={onNewGame}>
            <RefreshCw size={16} /> New game
          </Button>
        </div>
        <p className="border-t border-line px-4 py-3 text-xs leading-relaxed text-dim">
          Practice board against a simple computer opponent. Online play and server-validated moves come in the next phases.
        </p>
      </aside>
    </div>
  );
}
