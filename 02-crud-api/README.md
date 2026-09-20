# 02 · CRUD API

A RESTful resource built with convention routing, `zod/mini` schemas, a service layer, and a typed error class.

## What it demonstrates

- Convention routing — `index` / `show` / `create` / `update` / `destroy` map to REST verbs automatically
- Request and response validation with `zod/mini` builders
- `named()` from `stratal/validation` to publish reusable OpenAPI components
- Constructor injection with `@inject()`
- Domain errors that extend `HttpException` instead of hand-rolled error payloads

## Run it

```bash
npm install
npm run dev
```

Routes are versioned through the entry point, so every controller path is served under `/api/v1`:

```ts
export default new Stratal({
  module: AppModule,
  versioning: { prefix: 'api/v', defaultVersion: '1' },
})
```

## Try it

Create a note:

```bash
curl -X POST http://localhost:8787/api/v1/notes \
  -H 'Content-Type: application/json' \
  -d '{"title":"First note","content":"Hello from Stratal"}'
```

```json
{"data":{"id":"ce662e1a-70ac-4da9-b7e2-26ff948ebdc8","title":"First note","content":"Hello from Stratal","createdAt":"2026-09-20T20:39:33.843Z","updatedAt":"2026-09-20T20:39:33.843Z"}}
```

List, read, update, and delete:

```bash
curl http://localhost:8787/api/v1/notes
curl http://localhost:8787/api/v1/notes/<id>
curl -X PUT http://localhost:8787/api/v1/notes/<id> \
  -H 'Content-Type: application/json' -d '{"title":"Updated title"}'
curl -X DELETE http://localhost:8787/api/v1/notes/<id>
```

A missing note returns the `HttpException` thrown by the controller:

```bash
curl -i http://localhost:8787/api/v1/notes/does-not-exist
```

```
HTTP/1.1 404 Not Found
{"message":"Note does-not-exist not found","timestamp":"2026-09-20T20:39:33.931Z"}
```

A body that fails its schema is rejected before the handler runs:

```bash
curl -i -X POST http://localhost:8787/api/v1/notes \
  -H 'Content-Type: application/json' -d '{"title":""}'
```

```
HTTP/1.1 400 Bad Request
{"message":"Schema validation failed","timestamp":"2026-09-20T20:39:33.967Z"}
```

Notes live in an in-memory map, so they reset whenever the worker isolate restarts.

## Inspect it

```bash
npx quarry route:list
```

## Key files

- [`src/index.ts`](src/index.ts) — entry point and versioning config
- [`src/notes/notes.controller.ts`](src/notes/notes.controller.ts) — the five REST handlers
- [`src/notes/notes.schemas.ts`](src/notes/notes.schemas.ts) — `zod/mini` schemas
- [`src/notes/notes.service.ts`](src/notes/notes.service.ts) — storage layer
- [`src/notes/note-not-found.error.ts`](src/notes/note-not-found.error.ts) — domain error

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
