# 01 · Hello World

The smallest possible Stratal app: one module, one controller, one route.

## What it demonstrates

- `Stratal` worker entry point
- `@Module()` to declare controllers
- `@Controller()` for a route prefix
- Convention routing — `index()` maps to `GET /api/hello`
- Response schemas built with `zod/mini` and named for OpenAPI via `named()`

## Run it

```bash
npm install
npm run dev
```

## Try it

```bash
curl http://localhost:8787/api/hello
```

```json
{"message":"Hello World"}
```

Every Stratal response carries an explicit `Cache-Control`. Routes that do not opt into caching are stamped `private, no-store`.

## Inspect it

```bash
npx quarry route:list
```

```
Method  Path        Name         Handler                Domain
------  ----------  -----------  ---------------------  ------
GET     /api/hello  hello.index  HelloController.index  -
```

## Key files

- [`src/index.ts`](src/index.ts) — worker entry point
- [`src/quarry.ts`](src/quarry.ts) — Quarry CLI entry point
- [`src/app.module.ts`](src/app.module.ts) — root module
- [`src/hello.controller.ts`](src/hello.controller.ts) — the controller
- [`src/types/env.ts`](src/types/env.ts) — `StratalEnv` augmentation for your Cloudflare bindings

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
