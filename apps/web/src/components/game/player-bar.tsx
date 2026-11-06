import { cn } from '@/lib/cn';
import { GLYPH, VALUE, type PieceType, type Side } from '@/lib/chess/pieces';
import { Clock } from './clock';

interface Props {
  name: string;
  rating: number;
  initial: string;
  /** Pieces this player has captured, and the colour those pieces are. */
  captured: PieceType[];
  capturedColor: Side;
  /** Material lead in pawns, shown only when positive. */
  lead: number;
  clockMs: number;
  clockActive: boolean;
}

export function PlayerBar({ name, rating, initial, captured, capturedColor, lead, clockMs, clockActive }: Props) {
  const sorted = [...captured].sort((a, b) => VALUE[b] - VALUE[a]);
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-accent to-[#6b8fb0] font-bold text-[#10131c]">{initial}</div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold">
            {name} <span className="tabular font-normal text-dim">{rating}</span>
          </p>
          <p className="flex h-5 items-center gap-1 text-sm text-dim" aria-label="Captured pieces">
            <span className={cn('piece-glyph text-base tracking-tighter', capturedColor === 'w' ? 'piece-w' : 'piece-b')} style={capturedColor === 'w' ? { textShadow: '0 0 1px #000, 0 0 1px #000' } : undefined}>
              {sorted.map((t) => GLYPH[t]).join('')}
            </span>
            {lead > 0 && <span className="tabular text-xs font-semibold">+{lead}</span>}
          </p>
        </div>
      </div>
      <Clock ms={clockMs} active={clockActive} />
    </div>
  );
}
