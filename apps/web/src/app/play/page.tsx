import type { Metadata } from 'next';
import { GameScreen } from '@/components/game/game-screen';
import { Header } from '@/components/layout/header';

export const metadata: Metadata = { title: 'Play | GamePitch' };

export default function PlayPage() {
  return (
    <>
      <Header />
      <GameScreen />
    </>
  );
}
