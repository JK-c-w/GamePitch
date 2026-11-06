import { ChevronRight, DoorOpen, Lock, Users, Zap, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface Action { title: string; text: string; icon: LucideIcon; href?: string }

const ACTIONS: Action[] = [
  { title: 'Quick play', text: 'Start a game right now', icon: Zap, href: '/play' },
  { title: 'Play with a friend', text: 'Send an invite link', icon: Users },
  { title: 'Create private room', text: 'Pick the time control, share the code', icon: Lock },
  { title: 'Join room', text: 'Enter a room code or link', icon: DoorOpen },
];

export function PlayActions() {
  return (
    <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
      {ACTIONS.map(({ title, text, icon: Icon, href }) => {
        const body = (
          <>
            <span className={cn('grid size-11 place-items-center rounded-lg', href ? 'bg-accent text-accent-ink' : 'bg-surface-2 text-dim')}><Icon size={20} /></span>
            <span className="flex-1 text-left">
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm text-dim">{href ? text : 'Needs online play (Phase 5)'}</span>
            </span>
            {href && <ChevronRight size={18} className="text-dim transition-transform group-hover:translate-x-1" />}
          </>
        );
        return (
          <li key={title}>
            {href ? (
              <Link href={href} className="group flex items-center gap-4 px-4 py-4 transition-colors hover:bg-surface-2">{body}</Link>
            ) : (
              <div aria-disabled="true" className="flex items-center gap-4 px-4 py-4 opacity-60">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
