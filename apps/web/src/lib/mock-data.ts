/** Placeholder data for the dashboard. Replaced by real API data in Phase 4 / 7. */
export const mockProfile = { username: 'Guest player', rating: 1642, games: 248, wins: 131, losses: 87, draws: 30 };

export interface RecentGame { id: string; opponent: string; opponentRating: number; result: 'win' | 'loss' | 'draw'; timeControl: string; ratingChange: number; when: string }

export const mockRecentGames: RecentGame[] = [
  { id: '1', opponent: 'knightfall', opponentRating: 1655, result: 'win', timeControl: '5+0', ratingChange: 9, when: 'Today' },
  { id: '2', opponent: 'e4_always', opponentRating: 1701, result: 'loss', timeControl: '3+2', ratingChange: -7, when: 'Today' },
  { id: '3', opponent: 'quietrook', opponentRating: 1620, result: 'draw', timeControl: '10+0', ratingChange: 0, when: 'Yesterday' },
  { id: '4', opponent: 'zugzwang_zed', opponentRating: 1588, result: 'win', timeControl: '5+0', ratingChange: 8, when: 'Yesterday' },
  { id: '5', opponent: 'bishopblue', opponentRating: 1674, result: 'win', timeControl: '15+10', ratingChange: 11, when: 'Mon' },
  { id: '6', opponent: 'pawnstorm', opponentRating: 1709, result: 'loss', timeControl: '3+2', ratingChange: -8, when: 'Sun' },
];
