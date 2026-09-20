# 10 · Events

A type-safe event bus: one action, several independent listeners.

## What it demonstrates

- `@Listener()` classes with `@On('event.name')` handlers
- Type-safe event names and payloads by augmenting `CustomEventRegistry`
- Emitting with `IEventRegistry.emit()` injected via `DI_TOKENS.EventRegistry`
- `priority` to order handlers for the same event

## Run it

```bash
npm install
npm run dev
```

## Try it

Creating a note emits `note.notify`, `note.index` and `note.webhook`:

```bash
curl -X POST http://localhost:8787/api/v1/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"Launch plan","content":"Ship the thing"}'
```

Updating emits two events, deleting emits one:

```bash
curl -X PUT http://localhost:8787/api/v1/notes/<id> \
  -H 'Content-Type: application/json' -d '{"title":"Launch plan v2"}'
curl -X DELETE http://localhost:8787/api/v1/notes/<id>
```

The counts show how many times each event fired:

```bash
curl http://localhost:8787/api/v1/stats
```

```json
{"data":{"notify":1,"index":2,"webhook":3}}
```

The `wrangler dev` output shows the listeners running, with the higher-priority handler first:

```
[Notification] Sending push notification to collaborator-1: "Launch plan" (ee9ef730…)
[Stats] Total notifications dispatched: 1
[SearchIndex] Queuing create for note "Launch plan" (ee9ef730…)
[Stats] Total search index updates: 1
```

## Inspect it

```bash
npx quarry event:list
```

## Key files

- [`src/types/events.ts`](src/types/events.ts) — event names and payload types
- [`src/notes/notes.service.ts`](src/notes/notes.service.ts) — emitting
- [`src/listeners/`](src/listeners/) — three listeners reacting independently

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
