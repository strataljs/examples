# 08 · OpenAPI

Generating an OpenAPI document and browsing it in a docs UI, straight from route schemas.

## What it demonstrates

- `OpenAPIModule.forRoot()` with API `info`
- Route schemas doubling as API documentation — no separate spec to maintain
- `summary` and `description` on each route
- `describe()` for field-level docs and `named()` for a reusable component
- Versioned paths appearing in the generated document

## Run it

```bash
npm install
npm run dev
```

## Try it

The JSON document:

```bash
curl http://localhost:8787/api/openapi.json
```

```
openapi  3.0.0
info     {"title": "Users API", "version": "1.0.0", ...}
paths    ['/api/v1/users', '/api/v1/users/{id}']
```

`User` is emitted once and referenced everywhere it appears:

```json
{"type":"object","properties":{"data":{"type":"array","items":{"$ref":"#/components/schemas/User"}}},"required":["data"],"additionalProperties":false}
```

The docs UI:

```bash
open http://localhost:8787/api/docs
```

The endpoints themselves work as normal:

```bash
curl -X POST http://localhost:8787/api/v1/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Ada","email":"ada@example.com"}'
```

`role` is omitted above and defaults to `member`.

## A note on `named()`

`named()` registers a schema as a reusable component. In stratal `0.1.0` a named schema passed *directly* as a body or response is emitted as a `$ref` to itself, so this example names only `User` — which is referenced from inside the list and response wrappers — and leaves the wrappers anonymous.

## Key files

- [`src/app.module.ts`](src/app.module.ts) — `OpenAPIModule.forRoot()`
- [`src/users/users.schemas.ts`](src/users/users.schemas.ts) — schemas with `describe()` and `named()`
- [`src/users/users.controller.ts`](src/users/users.controller.ts) — `summary` / `description` per route

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
