# 11 · Auth

Session-based authentication with Better Auth on D1, plus a guard-protected route.

## What it demonstrates

- `AuthModule.forRootAsync()` wiring Better Auth into the app
- Mounting the Better Auth handler with `@All('/*')` on a version-neutral controller
- `@UseGuards(AuthGuard())` to require a session
- `AuthContext.requireUser()` for the signed-in user
- A public route alongside a protected one

## Run it

```bash
npm install
npm run setup   # applies the D1 migrations locally
npm run dev
```

`setup` runs `wrangler d1 migrations apply DB --local`. The Better Auth tables come from [`migrations/`](migrations/) rather than from Better Auth's own migrator.

## Two D1 details

Better Auth assumes it can inspect the database. D1 refuses both, so [`src/auth/auth.config.ts`](src/auth/auth.config.ts) turns them off:

- `type: 'sqlite'` — without it the adapter reads `sqlite_master` to detect the dialect, which D1 rejects with `SQLITE_AUTH`.
- `advanced.database.validateSchema: false` — the startup schema check introspects the same way.

`transaction: false` is also set, because D1 has no interactive transactions.

## Try it

Better Auth rejects a state-changing request whose `Origin` does not match `baseURL`, so pass one:

```bash
curl -X POST http://localhost:8787/api/auth/sign-up/email \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:8787' \
  -d '{"email":"grace@example.com","password":"supersecret123","name":"Grace Hopper"}' \
  -c cookies.txt
```

```json
{"token":"S3bDlHJ04euFRrn0zkJJP2WUU6eN6qmH","user":{"name":"Grace Hopper","email":"grace@example.com","emailVerified":false,"image":null,"createdAt":"2026-09-20T21:18:21.336Z","updatedAt":"2026-09-20T21:18:21.336Z","id":"OXT66253eeQuD7vYU7O3HNP8bJ0CHF7o"}}
```

The session cookie now reaches the protected route:

```bash
curl http://localhost:8787/api/v1/profile -b cookies.txt
```

```json
{"data":{"userId":"OXT66253eeQuD7vYU7O3HNP8bJ0CHF7o","email":"grace@example.com","authenticated":true}}
```

Sign out, then try again:

```bash
curl -X POST http://localhost:8787/api/auth/sign-out \
  -H 'Content-Type: application/json' \
  -H 'Origin: http://localhost:8787' \
  -d '{}' -b cookies.txt -c cookies.txt
```

```json
{"success":true}
```

```bash
curl -i http://localhost:8787/api/v1/profile -b cookies.txt   # 401
curl http://localhost:8787/api/v1/public                      # 200, no session needed
```

Signing in again uses the same shape as sign-up:

```bash
curl -X POST http://localhost:8787/api/auth/sign-in/email \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:8787' \
  -d '{"email":"grace@example.com","password":"supersecret123"}' -c cookies.txt
```

Send `-d '{}'` on `sign-out` — a `Content-Type: application/json` request with an empty body fails body parsing and returns a 500.

## Key files

- [`src/auth/auth.config.ts`](src/auth/auth.config.ts) — Better Auth options for D1
- [`src/auth/auth.controller.ts`](src/auth/auth.controller.ts) — mounts the handler at `/api/auth/*`
- [`src/profile/profile.controller.ts`](src/profile/profile.controller.ts) — guarded route
- [`migrations/0001_create_auth_tables.sql`](migrations/0001_create_auth_tables.sql) — the auth tables

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
