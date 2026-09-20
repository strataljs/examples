# 15 · Multi-Connection Database

Two independent Postgres databases in one app, with events crossing between them.

## What it demonstrates

- `DatabaseModule.forRootAsync()` with two named connections and a `default`
- `@InjectDB('main')` and `@InjectDB('analytics')` side by side, each fully typed
- Separate `.zmodel` schemas generated and pushed independently
- A listener on a `main` write that records into `analytics`
- One Hyperdrive binding per connection

## Run it

```bash
npm install
npm run setup
npm run dev
```

`setup` copies `.env.example` to `.env`, starts both databases, generates both clients, and pushes both schemas. Stop them with `npm run db:down`.

The two databases listen on different ports — `main` on `6432`, `analytics` on `7432` — matching the bindings in [`wrangler.jsonc`](wrangler.jsonc) and the URLs in `.env`.

## Try it

Create a user in `main`:

```bash
curl -X POST http://localhost:8787/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"email":"ada@example.com","name":"Ada Lovelace"}'
```

```json
{"data":{"id":"cmuabcd3a000000iikb4quf43","email":"ada@example.com","name":"Ada Lovelace","createdAt":"2026-09-20T21:13:14.567Z","updatedAt":"2026-09-20T21:13:14.569Z"}}
```

Add a post for that user, also in `main`:

```bash
curl -X POST http://localhost:8787/api/v1/users/<id>/posts \
  -H 'Content-Type: application/json' \
  -d '{"title":"First post","content":"Hello","published":true}'
```

Neither request touched the analytics database directly, but both were recorded there by `UserAnalyticsListener`:

```bash
curl http://localhost:8787/api/v1/analytics/events
```

```
- post.created | {"postId":"cmuabcjq2000200iitpoljvcz"}
- user.signup  | {"userId":"cmuabcd3a000000iikb4quf43"}
```

Analytics can also be written to directly:

```bash
curl -X POST http://localhost:8787/api/v1/analytics/page-views \
  -H 'Content-Type: application/json' -d '{"path":"/pricing"}'
```

## Key files

- [`src/database/database.config.ts`](src/database/database.config.ts) — both connections
- [`src/database/database.types.ts`](src/database/database.types.ts) — schema types per connection
- [`src/listeners/user-analytics.listener.ts`](src/listeners/user-analytics.listener.ts) — main → analytics
- [`db/main/schema.zmodel`](db/main/schema.zmodel) and [`db/analytics/schema.zmodel`](db/analytics/schema.zmodel)

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
