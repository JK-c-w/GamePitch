'use client';

import { animate, motion, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { GLYPH, squareToCell, type BoardPiece, type Orientation, type Square } from '@/lib/chess/pieces';

const SPRING = { type: 'spring', stiffness: 520, damping: 42, mass: 0.8 } as const;

interface Props {
  piece: BoardPiece;
  cell: number; // pixel size of one square
  orientation: Orientation;
  draggable: boolean;
  onTap: (square: Square) => void;
  onDragBegin: (square: Square) => void;
  /** Return true if the move was accepted; otherwise the piece snaps back. */
  onDragFinish: (from: Square, point: { x: number; y: number }) => boolean;
}

export function PieceView({ piece, cell, orientation, draggable, onTap, onDragBegin, onDragFinish }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [lifted, setLifted] = useState(false);
  const placed = useRef(false);

  const { col, row } = squareToCell(piece.square, orientation);
  const tx = col * cell;
  const ty = row * cell;

  // First paint: jump into place. After that, every change of square (a move, or flipping the board) glides.
  useEffect(() => {
    if (cell === 0) return;
    if (!placed.current) {
      x.set(tx);
      y.set(ty);
      placed.current = true;
      return;
    }
    const ax = animate(x, tx, SPRING);
    const ay = animate(y, ty, SPRING);
    return () => {
      ax.stop();
      ay.stop();
    };
  }, [tx, ty, cell, x, y]);

  return (
    <motion.div
      className={cn('pointer-events-auto absolute left-0 top-0 grid select-none place-items-center', draggable ? 'cursor-grab' : 'cursor-default', lifted && 'cursor-grabbing')}
      style={{ x, y, width: cell, height: cell, zIndex: lifted ? 30 : 10, fontSize: cell * 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.18 } }}
      whileDrag={{ scale: 1.15 }}
      drag={draggable}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        setLifted(true);
        onDragBegin(piece.square);
      }}
      onDragEnd={(_, info) => {
        setLifted(false);
        if (!onDragFinish(piece.square, info.point)) {
          animate(x, tx, SPRING);
          animate(y, ty, SPRING);
        }
      }}
      onTap={() => onTap(piece.square)}
    >
      <span className={cn('piece-glyph pointer-events-none', piece.color === 'w' ? 'piece-w' : 'piece-b')}>{GLYPH[piece.type]}</span>
    </motion.div>
  );
}
