import type {
  ChatMessage, ClockState, GameResultKind, GameSnapshot, MovePayload,
  MoveRecord, PlayerSummary, TimeControl, Color,
} from './types';

/** Event names: use these constants on both sides, never string literals. */
export const C2S = {
  createGame: 'create_game',
  joinGame: 'join_game',
  makeMove: 'make_move',
  offerDraw: 'offer_draw',
  respondDraw: 'respond_draw',
  resignGame: 'resign_game',
  requestRematch: 'request_rematch',
  sendChatMessage: 'send_chat_message',
  playerReconnect: 'player_reconnect',
  playerLeave: 'player_leave',
} as const;

export const S2C = {
  gameCreated: 'game_created',
  gameJoined: 'game_joined',
  opponentJoined: 'opponent_joined',
  moveMade: 'move_made',
  boardUpdated: 'board_updated',
  clockUpdated: 'clock_updated',
  drawOffered: 'draw_offered',
  drawResponse: 'draw_response',
  gameOver: 'game_over',
  rematchRequested: 'rematch_requested',
  chatMessageReceived: 'chat_message_received',
  opponentDisconnected: 'opponent_disconnected',
  opponentReconnected: 'opponent_reconnected',
  errorMessage: 'error_message',
} as const;

/** Typed payloads. Client -> Server */
export interface ClientToServerEvents {
  create_game: (p: { timeControl: TimeControl; color: Color | 'random'; isPrivate: boolean }) => void;
  join_game: (p: { gameId: string }) => void;
  make_move: (p: { gameId: string; move: MovePayload; clientMoveId: string }) => void;
  offer_draw: (p: { gameId: string }) => void;
  respond_draw: (p: { gameId: string; accept: boolean }) => void;
  resign_game: (p: { gameId: string }) => void;
  request_rematch: (p: { gameId: string }) => void;
  send_chat_message: (p: { gameId: string; text: string }) => void;
  player_reconnect: (p: { gameId: string }) => void;
  player_leave: (p: { gameId: string }) => void;
}

/** Typed payloads. Server -> Client */
export interface ServerToClientEvents {
  game_created: (p: { gameId: string; inviteUrl: string }) => void;
  game_joined: (p: { snapshot: GameSnapshot; role: Color | 'spectator' }) => void;
  opponent_joined: (p: { player: PlayerSummary }) => void;
  move_made: (p: { gameId: string; move: MoveRecord }) => void;
  board_updated: (p: { snapshot: GameSnapshot }) => void;
  clock_updated: (p: { gameId: string; clock: ClockState }) => void;
  draw_offered: (p: { gameId: string; by: Color }) => void;
  draw_response: (p: { gameId: string; accepted: boolean }) => void;
  game_over: (p: { gameId: string; kind: GameResultKind; winner: Color | null }) => void;
  rematch_requested: (p: { gameId: string; by: Color }) => void;
  chat_message_received: (p: { message: ChatMessage }) => void;
  opponent_disconnected: (p: { gameId: string; reconnectDeadline: number }) => void;
  opponent_reconnected: (p: { gameId: string }) => void;
  error_message: (p: { code: string; message: string }) => void;
}
