/** Scripted checks for castling (both sides, both wings), en passant and promotion. */
import { Chess } from 'chess.js';
import { applyMove, piecesFromFen } from '../src/lib/chess/pieces';

const key = (ps: { square: string; type: string; color: string }[]) => ps.map((p) => `${p.square}:${p.color}${p.type}`).sort().join(',');

function play(startFen: string | undefined, sans: string[]) {
  const chess = new Chess(startFen);
  let pieces = piecesFromFen(chess.fen());
  const ids = new Map(pieces.map((p) => [p.id, p.square]));
  for (const san of sans) {
    const m = chess.move(san);
    pieces = applyMove(pieces, m);
    if (key(pieces) !== key(piecesFromFen(chess.fen()))) throw new Error(`Mismatch after ${san}`);
  }
  if (new Set(pieces.map((p) => p.id)).size !== pieces.length) throw new Error('Duplicate ids');
  console.log(`OK: ${sans.join(' ')}`);
  return ids;
}

play(undefined, ['e4', 'e5', 'Nf3', 'Nf6', 'Bc4', 'Bc5', 'O-O', 'O-O']);                 // kingside, both colours
play(undefined, ['d4', 'd5', 'Nc3', 'Nc6', 'Bf4', 'Bf5', 'Qd2', 'Qd7', 'O-O-O', 'O-O-O']); // queenside, both colours
play(undefined, ['e4', 'a6', 'e5', 'd5', 'exd6']);                                        // en passant
play('8/P6k/8/8/8/8/7K/8 w - - 0 1', ['a8=Q']);                                           // promotion
play('1n6/P6k/8/8/8/8/7K/8 w - - 0 1', ['axb8=N']);                                       // capture + promotion
