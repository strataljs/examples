# 16 · Workers

Durable Objects, Workflows, and Service Binding RPC — each with full dependency injection.

## What it demonstrates

- `StratalDurableObject` for per-user counters backed by DO storage
- `StratalWorkflow` for a multi-step, durable process
- `StratalWorkerEntrypoint` for RPC callable from other workers
- `this.runInScope(container => …)` to reach DI services outside the HTTP request path
- Re-exporting the classes from `src/index.ts` so Wrangler can find them

> These runtime classes sit outside the normal fetch handler, so request-scoped services are not available directly. `runInScope()` opens a request container per call — inside a Durable Object it also registers `DI_TOKENS.DurableObjectState` and `DI_TOKENS.DurableObjectId`.

The `exports` loopback used to call `TaskRpc` and `TaskCounter` from a controller needs the `enable_ctx_exports` compatibility flag, which [`wrangler.jsonc`](wrangler.jsonc) sets.

## Run it

```bash
npm install
npm run dev
```

## Try it

Create a task — this also increments that user's Durable Object counter:

```bash
curl -X POST http://localhost:8787/api/v1/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Index the docs","userId":"user-1"}'
```

```json
{"task":{"id":"8619125b-…","title":"Index the docs","userId":"user-1","status":"pending","createdAt":"2026-09-20T21:07:00.210Z"},"counterValue":1}
```

Read the counter straight from DO storage:

```bash
curl http://localhost:8787/api/v1/tasks/user/user-1/count
```

```json
{"count":2}
```

Look a task up through the RPC entrypoint:

```bash
curl http://localhost:8787/api/v1/tasks/<id>
```

Start the workflow:

```bash
curl -X POST http://localhost:8787/api/v1/tasks/<id>/process
```

```json
{"instanceId":"d3a61eaf-daa4-42de-9b02-bacc3a867c69"}
```

Its three steps run in order, each in its own DI scope:

```
[Workflow] Validating task: Index the docs
[Workflow] Processing task: Index the docs
[Workflow] Completed task: Index the docs
```

Reading the task again shows `"status":"completed"`.

## Key files

- [`src/task/task-counter.ts`](src/task/task-counter.ts) — Durable Object
- [`src/task/task-workflow.ts`](src/task/task-workflow.ts) — Workflow
- [`src/task/task-rpc.ts`](src/task/task-rpc.ts) — RPC entrypoint
- [`src/index.ts`](src/index.ts) — re-exports for Wrangler

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
