'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { LegalTarget } from '@/hooks/use-local-game';
import { FILES, GLYPH, cellToSquare, type BoardPiece, type Orientation, type PieceType, type Side, type Square } from '@/lib/chess/pieces';
import { PieceView } from './piece-view';

export interface BoardProps {
  pieces: BoardPiece[];
  orientation: Orientation;
  selected: Square | null;
  targets: LegalTarget[];
  lastMove: { from: Square; to: Square } | null;
  checkSquare: Square | null;
  /** Whether the user may pick this piece up right now. */
  canMovePiece: (piece: BoardPiece) => boolean;
  onSquareClick: (square: Square) => void;
  onDragBegin: (square: Square) => void;
  /** Return true if the move was accepted. */
  onDrop: (from: Square, to: Square) => boolean;
  promotion: { color: Side } | null;
  onPromote: (piece: Exclude<PieceType, 'p' | 'k'>) => void;
  onCancelPromotion: () => void;
  /** Overlays such as the game-over banner. */
  children?: ReactNode;
}

const PROMOTION_CHOICES = ['q', 'r', 'b', 'n'] as const;

export function Board({ pieces, orientation, selected, targets, lastMove, checkSquare, canMovePiece, onSquareClick, onDragBegin, onDrop, promotion, onPromote, onCancelPromotion, children }: BoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useLayoutEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    setSize(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setSize(entry?.contentRect.width ?? 0));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cell = size / 8;
  const targetMap = useMemo(() => new Map(targets.map((t) => [t.to, t])), [targets]);

  /** Converts the release point of a drag into a square and asks the parent to play it. */
  const handleDragFinish = (from: Square, point: { x: number; y: number }): boolean => {
    const el = boardRef.current;
    if (!el || cell === 0) return false;
    const rect = el.getBoundingClientRect();
    const col = Math.floor((point.x - window.scrollX - rect.left) / cell);
    const row = Math.floor((point.y - window.scrollY - rect.top) / cell);
    if (col < 0 || col > 7 || row < 0 || row > 7) return false;
    const to = cellToSquare(col, row, orientation);
    return to !== from && onDrop(from, to);
  };

  return (
    <div
      ref={boardRef}
      role="application"
      aria-label="Chessboard"
      className="relative aspect-square w-full select-none overflow-hidden rounded-md shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
    >
      {/* Squares + highlights */}
      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
        {Array.from({ length: 64 }, (_, i) => {
          const col = i % 8;
          const row = Math.floor(i / 8);
          const square = cellToSquare(col, row, orientation);
          const fileIdx = FILES.indexOf(square[0] as (typeof FILES)[number]);
          const dark = (fileIdx + Number(square[1])) % 2 === 1; // a1 is a dark square
          const target = targetMap.get(square);
          const isLast = lastMove && (square === lastMove.from || square === lastMove.to);
          return (
            <div
              key={square}
              data-square={square}
              onClick={() => onSquareClick(square)}
              className="relative cursor-pointer"
              style={{ background: dark ? 'var(--sq-dark)' : 'var(--sq-light)' }}
            >
              {isLast && <div className="absolute inset-0" style={{ background: 'var(--sq-last)' }} />}
              {square === selected && <div className="absolute inset-0" style={{ background: 'var(--sq-select)' }} />}
              {square === checkSquare && (
                <div className="check-pulse absolute inset-0" style={{ background: 'radial-gradient(circle, var(--sq-check) 0%, rgba(239,90,80,0.15) 75%)' }} />
              )}
              {target && !target.capture && <div className="dot-in absolute left-[36%] top-[36%] h-[28%] w-[28%] rounded-full bg-[rgba(10,15,28,0.35)]" />}
              {target?.capture && <div className="dot-in absolute inset-[6%] rounded-full border-[5px] border-[rgba(10,15,28,0.35)]" />}
              {col === 0 && <span className="pointer-events-none absolute left-1 top-0.5 text-[10px] font-semibold opacity-70 sm:text-xs" style={{ color: dark ? 'var(--sq-light)' : 'var(--sq-dark)' }}>{square[1]}</span>}
              {row === 7 && <span className="pointer-events-none absolute bottom-0.5 right-1 text-[10px] font-semibold opacity-70 sm:text-xs" style={{ color: dark ? 'var(--sq-light)' : 'var(--sq-dark)' }}>{square[0]}</span>}
            </div>
          );
        })}
      </div>

      {/* Pieces */}
      <div className="pointer-events-none absolute inset-0">
        <AnimatePresence initial={false}>
          {cell > 0 &&
            pieces.map((p) => (
              <PieceView
                key={p.id}
                piece={p}
                cell={cell}
                orientation={orientation}
                draggable={canMovePiece(p)}
                onTap={onSquareClick}
                onDragBegin={onDragBegin}
                onDragFinish={handleDragFinish}
              />
            ))}
        </AnimatePresence>
      </div>

      {/* Promotion picker */}
      <AnimatePresence>
        {promotion && (
          <motion.div
            className="absolute inset-0 z-40 grid place-items-center bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancelPromotion}
          >
            <motion.div
              className="flex gap-2 rounded-xl border border-line bg-surface p-3"
              initial={{ scale: 0.9, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {PROMOTION_CHOICES.map((t) => (
                <button
                  key={t}
                  aria-label={`Promote to ${t === 'q' ? 'queen' : t === 'r' ? 'rook' : t === 'b' ? 'bishop' : 'knight'}`}
                  onClick={() => onPromote(t)}
                  className="grid size-14 place-items-center rounded-lg bg-surface-2 text-4xl transition-colors hover:bg-accent/25 sm:size-16 sm:text-5xl"
                >
                  <span className={cn('piece-glyph', promotion.color === 'w' ? 'piece-w' : 'piece-b')} style={promotion.color === 'w' ? { textShadow: '0 0 2px #000, 0 0 2px #000' } : { textShadow: '0 0 1px #fff, 0 0 1px #fff' }}>{GLYPH[t]}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {children}
    </div>
  );
}
