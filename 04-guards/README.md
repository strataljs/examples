# 04 · Guards

Protecting routes with a guard that checks an API key header.

## What it demonstrates

- `CanActivate` guards from `stratal/guards`
- `@UseGuards()` applied at the controller level
- Injecting the Cloudflare env into a guard via `DI_TOKENS.CloudflareEnv`
- Returning `false` for a refusal (403) versus throwing an `HttpException` for a different status (401)

## Run it

```bash
npm install
npm run dev
```

The expected key is a plain var in [`wrangler.jsonc`](wrangler.jsonc). In a real app use `wrangler secret put` instead.

## Try it

No key at all — the guard throws its own 401:

```bash
curl -i http://localhost:8787/api/v1/articles
```

```
HTTP/1.1 401 Unauthorized
{"message":"Missing x-api-key header","timestamp":"2026-09-20T20:40:56.598Z"}
```

A key that does not match — `canActivate` returns `false`, which the framework turns into a 403:

```bash
curl -i http://localhost:8787/api/v1/articles -H 'x-api-key: nope'
```

```
HTTP/1.1 403 Forbidden
{"message":"Forbidden","timestamp":"2026-09-20T20:40:56.613Z"}
```

The correct key passes through:

```bash
curl http://localhost:8787/api/v1/articles -H 'x-api-key: my-secret-api-key'
```

```json
{"data":[{"id":"1","title":"Getting Started with Stratal"},{"id":"2","title":"Building APIs with Guards"}]}
```

```bash
curl http://localhost:8787/api/v1/articles/1 -H 'x-api-key: my-secret-api-key'
```

```json
{"data":{"id":"1","title":"Getting Started with Stratal","content":"This is a protected article."}}
```

## Key files

- [`src/auth/api-key.guard.ts`](src/auth/api-key.guard.ts) — the guard
- [`src/articles/articles.controller.ts`](src/articles/articles.controller.ts) — `@UseGuards()` on the controller

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
