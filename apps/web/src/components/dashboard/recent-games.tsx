import { cn } from '@/lib/cn';
import { mockRecentGames } from '@/lib/mock-data';

const LABEL = { win: 'Won', loss: 'Lost', draw: 'Draw' } as const;
const TONE = { win: 'text-ok', loss: 'text-danger', draw: 'text-dim' } as const;

export function RecentGames() {
  if (mockRecentGames.length === 0) return <p className="rounded-xl border border-line bg-surface p-6 text-dim">No games yet. Play your first one.</p>;
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {mockRecentGames.map((g) => (
        <li key={g.id} className="grid grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-3 transition-colors hover:bg-surface-2">
          <div className="min-w-0">
            <p className="truncate font-semibold">{g.opponent} <span className="tabular font-normal text-dim">{g.opponentRating}</span></p>
            <p className="text-sm text-dim">{g.timeControl} · {g.when}</p>
          </div>
          <div className="text-right">
            <p className={cn('font-semibold', TONE[g.result])}>{LABEL[g.result]}</p>
            <p className="tabular text-sm text-dim">{g.ratingChange > 0 ? `+${g.ratingChange}` : g.ratingChange}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
