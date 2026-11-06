'use client';

import { Chess, type Move, type Square } from 'chess.js';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Color, GameResultKind, TimeControl } from '@chess/shared';
import { applyMove, piecesFromFen, type BoardPiece, type PieceType, type Side } from '@/lib/chess/pieces';

export interface GameResult { kind: GameResultKind; winner: Color | null }
export interface LegalTarget { to: Square; capture: boolean; promotion: boolean }

function detectEnd(c: Chess): GameResult | null {
  if (c.isCheckmate()) return { kind: 'checkmate', winner: c.turn() === 'w' ? 'black' : 'white' };
  if (c.isStalemate()) return { kind: 'stalemate', winner: null };
  if (c.isInsufficientMaterial()) return { kind: 'insufficient_material', winner: null };
  if (c.isThreefoldRepetition()) return { kind: 'repetition', winner: null };
  if (c.isDrawByFiftyMoves()) return { kind: 'fifty_move', winner: null };
  return null;
}

/**
 * Local (single-device) game used while building the UI. In Phase 5/6 the server becomes
 * the source of truth and this hook is replaced by one that feeds server snapshots into the
 * same shape, so the board components do not change.
 */
export function useLocalGame({ timeControl, botColor }: { timeControl: TimeControl; botColor: Side | null }) {
  const [chess] = useState(() => new Chess());
  const [pieces, setPieces] = useState<BoardPiece[]>(() => piecesFromFen(chess.fen()));
  const [history, setHistory] = useState<Move[]>([]);
  const [result, setResult] = useState<GameResult | null>(null);

  const initialMs = timeControl.initialSeconds * 1000;
  const [clock, setClock] = useState({ w: initialMs, b: initialMs });
  const clockRef = useRef(clock);
  const lastTick = useRef(0);

  // Clocks start once both sides have moved (same convention as most online sites).
  useEffect(() => {
    if (result || history.length < 2) return;
    lastTick.current = Date.now();
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - lastTick.current;
      lastTick.current = now;
      const side = chess.turn();
      const next = { ...clockRef.current, [side]: Math.max(0, clockRef.current[side] - dt) };
      clockRef.current = next;
      setClock(next);
      if (next[side] <= 0) setResult({ kind: 'timeout', winner: side === 'w' ? 'black' : 'white' });
    }, 100);
    return () => clearInterval(id);
  }, [result, history.length, chess]);

  const makeMove = useCallback(
    (from: Square, to: Square, promotion?: PieceType): boolean => {
      if (result) return false;
      const before = chess.history().length;
      let move: Move;
      try {
        move = chess.move({ from, to, promotion });
      } catch {
        return false; // illegal move: chess.js throws
      }
      if (before >= 2) {
        clockRef.current = { ...clockRef.current, [move.color]: clockRef.current[move.color] + timeControl.incrementSeconds * 1000 };
        setClock(clockRef.current);
      }
      setPieces((p) => applyMove(p, move));
      setHistory(chess.history({ verbose: true }));
      const end = detectEnd(chess);
      if (end) setResult(end);
      return true;
    },
    [chess, result, timeControl.incrementSeconds],
  );

  // Practice opponent: prefers captures and checks, otherwise random.
  useEffect(() => {
    if (!botColor || result || chess.turn() !== botColor) return;
    const id = setTimeout(() => {
      const all = chess.moves({ verbose: true });
      if (all.length === 0) return;
      const strong = all.filter((m) => m.isCapture() || m.san.includes('+') || m.promotion);
      const pool = strong.length > 0 && Math.random() < 0.65 ? strong : all;
      const pick = pool[Math.floor(Math.random() * pool.length)]!;
      makeMove(pick.from, pick.to, pick.promotion);
    }, 650 + Math.random() * 450);
    return () => clearTimeout(id);
  }, [botColor, result, history.length, chess, makeMove]);

  const legalMovesFrom = useCallback(
    (square: Square): LegalTarget[] => {
      const out = new Map<Square, LegalTarget>();
      for (const m of chess.moves({ square, verbose: true })) {
        out.set(m.to, { to: m.to, capture: m.isCapture() || m.isEnPassant(), promotion: Boolean(m.promotion) });
      }
      return [...out.values()];
    },
    [chess],
  );

  const resign = useCallback((side: Side) => {
    setResult((r) => r ?? { kind: 'resignation', winner: side === 'w' ? 'black' : 'white' });
  }, []);

  const turn = chess.turn();
  const lastMove = history.length > 0 ? { from: history[history.length - 1]!.from, to: history[history.length - 1]!.to } : null;

  const checkSquare = useMemo(() => {
    if (!chess.isCheck()) return null;
    return pieces.find((p) => p.type === 'k' && p.color === chess.turn())?.square ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces, history.length, chess]);

  /** Pieces each side has captured, plus a material balance (positive = white ahead). */
  const captured = useMemo(() => {
    const byWhite: PieceType[] = [];
    const byBlack: PieceType[] = [];
    for (const m of history) {
      if (!m.captured) continue;
      (m.color === 'w' ? byWhite : byBlack).push(m.captured);
    }
    return { byWhite, byBlack };
  }, [history]);

  return { pieces, history, result, clock, turn, lastMove, checkSquare, captured, makeMove, legalMovesFrom, resign };
}
