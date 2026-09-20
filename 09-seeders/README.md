# 09 · Seeders

Populating an app with starting data from the Quarry CLI.

## What it demonstrates

- A `Seeder` subclass with injected services
- Registering seeders as `providers` on the Quarry entry point, so they stay out of the worker bundle
- `quarry db:seed` and `quarry db:seed:list`
- Sharing state between the CLI and `wrangler dev` through a KV binding

> Seeders run in the Quarry process, not in your worker. They only produce data your app can read if they write somewhere shared — here, the `CACHE` KV namespace, which Quarry and `wrangler dev` both reach through the same local Miniflare state. A seeder writing to an in-memory map would appear to succeed and change nothing.

## Run it

```bash
npm install
```

List the seeders:

```bash
npx quarry db:seed:list
```

```
Class
-----------
NotesSeeder
```

Run one:

```bash
npx quarry db:seed NotesSeeder
```

```
✔ Seeder "NotesSeeder" completed
```

Run every seeder with `npx quarry db:seed --all`.

## Try it

```bash
npm run dev
curl http://localhost:8787/api/v1/notes
```

The three seeded notes come back:

```
- Getting Started | Seeders populate your app with initial data
- Stratal         | A modular Cloudflare Workers framework
- Welcome         | This note was created by a seeder
```

Adding more through the API works the same way:

```bash
curl -X POST http://localhost:8787/api/v1/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"Mine","content":"Added over HTTP"}'
```

Delete `.wrangler/` to reset the local KV state.

## Key files

- [`src/seeders/notes.seeder.ts`](src/seeders/notes.seeder.ts) — the seeder
- [`src/quarry.ts`](src/quarry.ts) — CLI entry registering it
- [`src/notes/notes.service.ts`](src/notes/notes.service.ts) — KV-backed storage shared by both

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
