# Stratal Examples

Focused examples for [Stratal](https://github.com/strataljs/stratal), a modular framework for Cloudflare Workers. Each one is a standalone project that runs on its own.

Built against **stratal 0.1.1**.

## Getting started

```bash
cd 01-hello-world
npm install
npm run dev
```

Examples that need a database or migrations have an extra `npm run setup` step — their README says so.

## Examples

| # | Name | What it covers |
|---|------|----------------|
| 01 | [hello-world](01-hello-world/) | One module, one controller, one route |
| 02 | [crud-api](02-crud-api/) | REST resource, `zod/mini` schemas, service layer, typed errors |
| 03 | [testing](03-testing/) | `@stratal/testing`, Vitest, HTTP assertions |
| 04 | [guards](04-guards/) | Route protection with `CanActivate` and `@UseGuards` |
| 05 | [middleware](05-middleware/) | Global and controller-scoped middleware via the Router |
| 06 | [queues](06-queues/) | Producing and consuming Cloudflare Queue messages |
| 07 | [scheduled-tasks](07-scheduled-tasks/) | Cron jobs with `static schedule` |
| 08 | [openapi](08-openapi/) | OpenAPI document and docs UI generated from route schemas |
| 09 | [seeders](09-seeders/) | Seeding data from the Quarry CLI |
| 10 | [events](10-events/) | Typed event bus with `@Listener` and `@On` |
| 11 | [auth](11-auth/) | Better Auth sessions on D1, with a guarded route |
| 12 | [database](12-database/) | ZenStack on Postgres via Hyperdrive, plus database events |
| 13 | [access-control](13-rbac/) | Roles and permissions with `createAccessControl` and `AuthGuard` |
| 14 | [factories](14-factories/) | Faker-backed test data with states and sequences |
| 15 | [multi-connection-database](15-multi-connection-database/) | Two databases in one app, with events crossing between them |
| 16 | [workers](16-workers/) | Durable Objects, Workflows and RPC entrypoints with DI |
| 17 | [commands](17-commands/) | Custom Quarry CLI commands |
| 18 | [inertia](18-inertia/) | Inertia.js v3 with React SSR, typed props and flash messages |

## Shared layout

```
XX-name/
  src/
    index.ts          # Worker entry point
    quarry.ts         # Quarry CLI entry point
    app.module.ts     # Root module
    types/env.ts      # StratalEnv augmentation
  package.json
  tsconfig.json
  wrangler.jsonc
  README.md
```

## Conventions

- **Routes are versioned in the entry point.** Controllers use plain paths like `/notes`; `versioning: { prefix: 'api/v', defaultVersion: '1' }` turns them into `/api/v1/notes`.
- **Schemas come from `zod/mini`.** Import builders directly (`object`, `string`, `minLength`) and apply constraints with `.check(...)`. `named()` and `describe()` from `stratal/validation` add OpenAPI metadata.
- **Every injected class carries a scope decorator** — `@Singleton()`, `@Request()` or `@Transient()` — and every constructor dependency an explicit `@inject()`. There is no `reflect-metadata` and no type-based auto-resolution.
- **Generated files are not committed.** Run `npm run wrangler:types` for `worker-configuration.d.ts`; example 18 also generates `inertia.d.ts`.

## Database ports

The database-backed examples use different ports so they can run at the same time:

| Example | Port |
|---------|------|
| 12-database | 6432 |
| 13-rbac | 6433 |
| 15-multi-connection-database | 6434 (main), 6435 (analytics) |

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)

## Star Stratal

If these examples helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
