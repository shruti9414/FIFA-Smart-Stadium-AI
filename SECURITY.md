# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability, please report it by emailing the project maintainers directly rather than opening a public issue. We will respond within 48 hours.

## Security Practices

### Secrets Management
- All API keys and database credentials are stored as environment variables — never committed to source code.
- Environment variables are validated at startup via Zod (`lib/env.ts`). The server refuses to boot with an invalid schema.
- `.env*` files are in `.gitignore` and excluded from all builds.

### Database
- All SQL queries use parameterized statements via `mysql2` — no string interpolation, no SQL injection surface.
- Database credentials are injected at runtime via Railway environment variables.
- The internal database URL (`MYSQL_URL`) is never exposed to the client bundle.

### API Security
- All API routes return JSON with explicit `Content-Type: application/json` via `NextResponse.json()`.
- Dynamic route parameters are always coerced to numbers (`parseInt`, `Number()`) before use in queries.
- AI endpoints return `503` with a clear message when the API key is not configured, rather than leaking internal errors.

### Rate Limiting
- `lib/utils/rateLimit.ts` provides per-IP rate limiting for AI endpoints to prevent abuse.

### Client-Side
- No secrets are included in the Next.js client bundle. All sensitive operations happen server-side in API routes.
- `NEXT_PUBLIC_*` variables (exposed to the browser) contain only the public Socket.IO URL — no credentials.

### Dependencies
- Dependencies are locked via `package-lock.json`.
- Run `npm audit` to check for known vulnerabilities before deployment.

## Supported Versions

This project is actively maintained. Security fixes are applied to the `main` branch only.
