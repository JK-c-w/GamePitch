# Gambit: real-time multiplayer chess

Monorepo (npm workspaces)

```
chess-platform/
├── docker-compose.yml        # PostgreSQL 16 + Redis 7
├── packages/shared/          # Socket event names + typed payloads (single wire contract)
├── apps/server/              # NestJS API + Socket.IO gateway
│   ├── prisma/               # schema lands in Phase 4
│   └── src/{config,health,auth,users,games,matchmaking,chat,gateway,common}
└── apps/web/                 # Next.js + Tailwind v4 + Framer Motion
    └── src/{app,components/{ui,board,game,dashboard,layout},hooks,lib,providers}
```

## Run (needs Node 20.11+ and Docker)

```bash
npm install
npm run infra:up            # Postgres + Redis
npm run dev:server          # http://localhost:4000/api/health
npm run dev:web             # http://localhost:3000
```

Copy each `.env.example` to `.env` (server) and `.env.local` (web). Change `JWT_SECRET` before deploying (`openssl rand -base64 48`).

## Environment variables

| App | Variable | Purpose |
|---|---|---|
| server | PORT | API port (4000) |
| server | CORS_ORIGINS | Allowed browser origins, comma-separated |
| server | WEB_URL | Used to build invite links |
| server | DATABASE_URL | PostgreSQL connection string |
| server | REDIS_URL | Socket.IO adapter; empty = single instance |
| server | JWT_SECRET, JWT_EXPIRES_IN | Auth tokens (secret must be 32+ chars; checked at boot) |
| web | NEXT_PUBLIC_API_URL, NEXT_PUBLIC_SOCKET_URL | Where the browser reaches the backend |

## Phase 2 (UI)

- `/` dashboard (profile, stats, play actions, recent games). Uses placeholder data from `apps/web/src/lib/mock-data.ts` until Phase 4/7.
- `/play` practice board vs a simple computer: drag and drop, click to move, legal-move dots, last-move and check highlights, promotion picker, board flip, clocks with increment, captured pieces, move list, result banner.
- Board components are presentational (`components/board`). Game state comes from `hooks/use-local-game.ts`, which Phase 5/6 replaces with a server-driven hook of the same shape.
- Checks: `npm run verify:pieces -w @chess/web` and `npm run verify:special -w @chess/web` confirm piece tracking matches chess.js (castling, en passant, promotion).
