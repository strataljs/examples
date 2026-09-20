# 17 · Commands

Custom Quarry CLI commands with argument parsing, DI, and KV persistence.

## What it demonstrates

- `Command` subclasses with a `static command` signature and `static description`
- Required, optional, default and variadic arguments; boolean, value and aliased options
- Command aliases via `static aliases`
- Input accessors (`this.string()`, `this.number()`, `this.boolean()`, `this.array()`)
- Output helpers (`this.success()`, `this.warn()`, `this.fail()`, `this.table()`)
- `this.call()` to run one command from another
- Registering commands as `providers` on the Quarry entry, keeping them out of the worker bundle

> Commands are injectable classes, so each needs an explicit scope decorator — `@Transient()` here — and dependencies are injected with `@inject()` from `stratal/di`.

## Run it

```bash
npm install
npx quarry list
```

## Try it

```bash
npx quarry task:add "Write the docs" --priority=high
npx quarry task:add "Ship the release"
```

```
✔ Task #1 created: "Write the docs" [high]
✔ Task #2 created: "Ship the release" [normal]
```

Variadic arguments:

```bash
npx quarry task:tag 1 docs urgent
```

```
✔ Task #1 tagged with: docs, urgent
  All tags: docs, urgent
```

Table output:

```bash
npx quarry task:list
```

```
ID  Title             Priority  Status   Tags
--  ----------------  --------  -------  ------------
1   Write the docs    high      pending  docs, urgent
2   Ship the release  normal    pending  -
```

An alias, an optional argument with a default, and a filter:

```bash
npx quarry task:done 2
npx quarry task:show 1 detailed
npx quarry task:list --status=done
```

```
Task #1
  Title:    Write the docs
  Priority: high
  Status:   pending
  Tags:     docs, urgent
  Created:  2026-09-20T21:05:16.566Z
```

Failure paths set a non-zero exit code:

```bash
npx quarry task:show 99      # ✖ Task #99 not found.
npx quarry task:reset        # ⚠ This will delete all tasks. Use --force to confirm.
```

Tasks persist in the `CACHE` KV namespace under `.wrangler/`. Delete that directory to start over.

## Key files

- [`src/quarry.ts`](src/quarry.ts) — CLI entry registering every command
- [`src/commands/`](src/commands/) — one file per command
- [`src/services/task.service.ts`](src/services/task.service.ts) — KV-backed storage

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
