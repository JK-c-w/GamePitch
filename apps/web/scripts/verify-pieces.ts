/** Plays random games and checks the tracked piece list always matches chess.js. Run: npm run verify:pieces */
import { Chess } from 'chess.js';
import { applyMove, piecesFromFen } from '../src/lib/chess/pieces';

const key = (ps: { square: string; type: string; color: string }[]) =>
  ps.map((p) => `${p.square}:${p.color}${p.type}`).sort().join(',');

let moves = 0, castles = 0, enPassant = 0, promos = 0;
for (let g = 0; g < 40; g++) {
  const chess = new Chess();
  let pieces = piecesFromFen(chess.fen());
  while (!chess.isGameOver() && chess.history().length < 200) {
    const list = chess.moves({ verbose: true });
    const m = chess.move(list[Math.floor(Math.random() * list.length)]!);
    pieces = applyMove(pieces, m);
    moves++;
    if (m.flags.includes('k') || m.flags.includes('q')) castles++;
    if (m.flags.includes('e')) enPassant++;
    if (m.promotion) promos++;
    if (key(pieces) !== key(piecesFromFen(chess.fen()))) throw new Error(`Mismatch after ${m.san} in game ${g}: ${chess.fen()}`);
  }
}
console.log(`OK: ${moves} moves checked (castles ${castles}, en passant ${enPassant}, promotions ${promos})`);
