# 03 · Testing

Testing a Stratal app with `@stratal/testing`, Vitest, and HTTP assertions.

## What it demonstrates

- `Test.createTestingModule({ imports })` to build an app in-process
- `module.http` for request/response assertions — `assertOk()`, `assertCreated()`, `assertNotFound()`, `assertJsonPath()`
- `module.get(Token)` to resolve a service straight from the container
- Mirroring the entry point's `versioning` config in tests

## Run it

```bash
npm install
npm test
```

```
 Test Files  1 passed (1)
      Tests  8 passed (8)
```

## Two things to get right

**Mirror the app's routing config.** The testing module builds its own application and never runs `src/index.ts`, so `versioning`, `trailingSlash` and `exceptionHandler` are not inherited. A suite that omits them asserts URLs the app never serves:

```ts
module = await Test.createTestingModule({
  imports: [NotesModule],
  versioning: { prefix: 'api/v', defaultVersion: '1' },
}).compile()
```

**Two dependency workarounds are needed with npm on stratal `0.1.0`:**

- `@stratal/framework` is a devDependency even though this example has no database. `@stratal/testing/vitest-plugin` imports `@stratal/framework/database` at the top level while declaring that peer optional, so `stratalTest()` cannot load without it.
- `@paralleldrive/cuid2` is pinned through `overrides`. The version pulled in transitively is a CommonJS wrapper around ESM source, which Vitest cannot load; `^3.3.0` ships real ESM.

```json
"overrides": { "@paralleldrive/cuid2": "^3.3.0" }
```

## Key files

- [`src/notes/__tests__/notes.spec.ts`](src/notes/__tests__/notes.spec.ts) — the suite
- [`vitest.config.ts`](vitest.config.ts) — the `stratalTest()` plugin
- [`src/notes/notes.service.ts`](src/notes/notes.service.ts) — `reset()` for test isolation

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
