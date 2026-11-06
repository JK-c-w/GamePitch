/** Fail fast at boot if configuration is missing or unsafe. */
export interface Env {
  PORT: number;
  CORS_ORIGINS: string[];
  WEB_URL: string;
  DATABASE_URL: string;
  REDIS_URL: string | null;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

export function validateEnv(raw: Record<string, unknown>): Record<string, unknown> {
  const str = (k: string, fallback?: string): string => {
    const v = raw[k] ?? fallback;
    if (typeof v !== 'string' || v.length === 0) throw new Error(`Missing required env var: ${k}`);
    return v;
  };

  const jwtSecret = str('JWT_SECRET');
  if (jwtSecret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters');

  const port = Number(str('PORT', '4000'));
  if (!Number.isInteger(port) || port <= 0) throw new Error('PORT must be a positive integer');

  const env: Env = {
    PORT: port,
    CORS_ORIGINS: str('CORS_ORIGINS', 'http://localhost:3000').split(',').map((s) => s.trim()),
    WEB_URL: str('WEB_URL', 'http://localhost:3000'),
    DATABASE_URL: str('DATABASE_URL'),
    REDIS_URL: typeof raw.REDIS_URL === 'string' && raw.REDIS_URL ? raw.REDIS_URL : null,
    JWT_SECRET: jwtSecret,
    JWT_EXPIRES_IN: str('JWT_EXPIRES_IN', '7d'),
  };
  return { ...raw, ...env };
}
