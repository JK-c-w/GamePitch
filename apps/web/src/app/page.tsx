import { Header } from '@/components/layout/header';
import { PlayActions } from '@/components/dashboard/play-actions';
import { ProfileStrip } from '@/components/dashboard/profile-strip';
import { RecentGames } from '@/components/dashboard/recent-games';

export default function Dashboard() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
        <ProfileStrip />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Play</h2>
            <PlayActions />
          </section>
          <section>
            <h2 className="mb-3 text-lg font-semibold">Recent games</h2>
            <RecentGames />
          </section>
        </div>
      </main>
    </>
  );
}
