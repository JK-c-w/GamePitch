import { Chess, type Move, type PieceSymbol, type Color as Side, type Square } from 'chess.js';

export type PieceType = PieceSymbol;
export type { Side, Square };

/** A piece with a stable id, so the UI can animate it from square to square. */
export interface BoardPiece {
  id: string;
  type: PieceType;
  color: Side;
  square: Square;
}

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

/** \uFE0E forces text (not emoji) rendering of the pawn glyph. */
export const GLYPH: Record<PieceType, string> = {
  k: '\u265A\uFE0E', q: '\u265B\uFE0E', r: '\u265C\uFE0E',
  b: '\u265D\uFE0E', n: '\u265E\uFE0E', p: '\u265F\uFE0E',
};

export const VALUE: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

export function piecesFromFen(fen: string): BoardPiece[] {
  const chess = new Chess(fen);
  const out: BoardPiece[] = [];
  for (const row of chess.board()) {
    for (const cell of row) {
      if (cell) out.push({ id: `${cell.color}${cell.type}@${cell.square}`, type: cell.type, color: cell.color, square: cell.square });
    }
  }
  return out;
}

type MoveLike = Pick<Move, 'from' | 'to' | 'flags' | 'color'> & { promotion?: string; captured?: string };

/**
 * Applies a move to the tracked piece list while keeping each piece's id.
 * Handles captures, en passant, castling (rook hop) and promotion.
 * The same function is reused for moves that arrive from the server in Phase 5/6.
 */
export function applyMove(pieces: BoardPiece[], m: MoveLike): BoardPiece[] {
  const isEnPassant = m.flags.includes('e');
  const capturedSquare = (isEnPassant ? `${m.to[0]}${m.from[1]}` : m.to) as Square;
  const rank = m.from[1];
  const kingside = m.flags.includes('k');
  const queenside = m.flags.includes('q');

  return pieces
    .filter((p) => !(m.captured && p.square === capturedSquare))
    .map((p) => {
      if (p.square === m.from) {
        return { ...p, square: m.to, type: (m.promotion as PieceType | undefined) ?? p.type };
      }
      if (p.type === 'r' && p.color === m.color) {
        if (kingside && p.square === `h${rank}`) return { ...p, square: `f${rank}` as Square };
        if (queenside && p.square === `a${rank}`) return { ...p, square: `d${rank}` as Square };
      }
      return p;
    });
}

export type Orientation = 'white' | 'black';

/** Column/row (0-7, from the top-left of the screen) for a square. */
export function squareToCell(square: Square, orientation: Orientation): { col: number; row: number } {
  const col = FILES.indexOf(square[0] as (typeof FILES)[number]);
  const row = 8 - Number(square[1]);
  return orientation === 'white' ? { col, row } : { col: 7 - col, row: 7 - row };
}

export function cellToSquare(col: number, row: number, orientation: Orientation): Square {
  const c = orientation === 'white' ? col : 7 - col;
  const r = orientation === 'white' ? row : 7 - row;
  return `${FILES[c]}${8 - r}` as Square;
}
