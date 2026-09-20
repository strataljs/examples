# 12 · Database

A ZenStack-backed API on Postgres, reached through a Hyperdrive binding, with database event listeners.

## What it demonstrates

- `DatabaseModule.forRootAsync()` with a named connection
- `@InjectDB('main')` and the typed `DatabaseService<'main'>` client
- Declaring the schema shape by augmenting `StratalDatabase`
- Database lifecycle events — `@On('after.Task.create')` and friends
- A Hyperdrive binding with a `localConnectionString` for local development

## Run it

Start Postgres, generate the ZenStack client, and push the schema:

```bash
npm install
npm run setup
```

`setup` runs `db:up`, `generate` and `db:push` in order. Then:

```bash
npm run dev
```

Stop the database with `npm run db:down`.

## Try it

```bash
curl -X POST http://localhost:8787/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Write migration","description":"Add the tasks table"}'
```

```json
{"data":{"id":"cmuab8owc000000iimrbb7o2u","title":"Write migration","description":"Add the tasks table","completed":false,"createdAt":"2026-09-20T21:10:23.244Z","updatedAt":"2026-09-20T21:10:23.246Z"}}
```

```bash
curl http://localhost:8787/api/v1/tasks
curl -X PUT http://localhost:8787/api/v1/tasks/<id> \
  -H 'Content-Type: application/json' -d '{"completed":true}'
curl -X DELETE http://localhost:8787/api/v1/tasks/<id>
```

A missing row returns a `404`:

```bash
curl -i http://localhost:8787/api/v1/tasks/nope
```

```
HTTP/1.1 404 Not Found
{"message":"Task nope not found","timestamp":"2026-09-20T21:10:23.375Z"}
```

Every write fires a database event, visible in the `wrangler dev` output:

```
[TaskListener] New task created: { … }
[TaskListener] Task updated: { … }
[TaskListener] Task deleted
```

## Key files

- [`db/schema.zmodel`](db/schema.zmodel) — the ZenStack model
- [`src/database/database.config.ts`](src/database/database.config.ts) — connection and dialect
- [`src/database/database.types.ts`](src/database/database.types.ts) — `StratalDatabase` augmentation
- [`src/tasks/tasks.controller.ts`](src/tasks/tasks.controller.ts) — queries through `@InjectDB`
- [`src/listeners/task.listener.ts`](src/listeners/task.listener.ts) — database events

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
