/** Types shared by the web client and the API so the wire contract is defined once. */

export type Color = 'white' | 'black';
export type GameStatus = 'waiting' | 'active' | 'finished' | 'aborted';
export type GameResultKind =
  | 'checkmate' | 'resignation' | 'timeout' | 'stalemate'
  | 'repetition' | 'fifty_move' | 'insufficient_material' | 'draw_agreement' | 'abandonment';
export type TimeCategory = 'bullet' | 'blitz' | 'rapid' | 'custom';

export interface TimeControl {
  /** Initial time per player, in seconds. */
  initialSeconds: number;
  /** Increment added after each move, in seconds (e.g. 3+2 => 2). */
  incrementSeconds: number;
}

export interface PlayerSummary {
  id: string;
  username: string;
  avatarUrl: string | null;
  rating: number;
  isGuest: boolean;
}

export interface ClockState {
  whiteMs: number;
  blackMs: number;
  /** Which side's clock is running, or null if paused / not started. */
  running: Color | null;
  /** Server timestamp (ms) at which these values were measured. */
  serverTime: number;
}

export interface MovePayload {
  from: string;
  to: string;
  promotion?: 'q' | 'r' | 'b' | 'n';
}

export interface MoveRecord {
  ply: number;
  san: string;
  uci: string;
  fen: string;
  color: Color;
  timeLeftMs: number;
}

export interface GameSnapshot {
  gameId: string;
  status: GameStatus;
  fen: string;
  pgn: string;
  moves: MoveRecord[];
  white: PlayerSummary | null;
  black: PlayerSummary | null;
  timeControl: TimeControl;
  clock: ClockState;
  turn: Color;
  result: { kind: GameResultKind; winner: Color | null } | null;
  drawOfferedBy: Color | null;
  spectators: number;
}

export interface ChatMessage {
  id: string;
  gameId: string;
  senderId: string;
  senderName: string;
  text: string;
  sentAt: string; // ISO timestamp
}
