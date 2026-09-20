# 06 · Queues

Dispatching messages to a Cloudflare Queue and consuming them in the same Worker.

## What it demonstrates

- `QueueModule.forRootAsync()` to pick a provider (`'cloudflare'` or `'sync'`)
- `QueueModule.registerQueue('NOTIFICATIONS_QUEUE')` to make a queue injectable
- `@InjectQueue()` + `IQueueSender.dispatch()` from a controller
- `IQueueConsumer` with `messageTypes` routing and an `onError` hook

> `registerQueue()` and `@InjectQueue()` take the **binding name** from `wrangler.jsonc` (`NOTIFICATIONS_QUEUE`), not the queue name (`notifications-queue`). Consumers are matched on `message.type`, not on the queue the message arrived on.

The queue subsystem persists idempotency claims and failed jobs to KV, which is why [`wrangler.jsonc`](wrangler.jsonc) declares a `CACHE` namespace. Override it with `store: { binding: 'YOUR_KV' }`.

## Run it

```bash
npm install
npm run dev
```

## Try it

```bash
curl -X POST http://localhost:8787/api/v1/notifications \
  -H 'Content-Type: application/json' \
  -d '{"to":"dev@example.com","subject":"Welcome","body":"Thanks for signing up"}'
```

```json
{"queued":true}
```

The consumer picks the message up a moment later and logs it in the `wrangler dev` output:

```
[NotificationConsumer] 6d2a3ae7-3c8c-4941-8a5a-81eafbbbc78c -> dev@example.com: [Welcome] Thanks for signing up
```

A bad payload never reaches the queue:

```bash
curl -i -X POST http://localhost:8787/api/v1/notifications \
  -H 'Content-Type: application/json' \
  -d '{"to":"not-an-email","subject":"x","body":"y"}'
```

```
HTTP/1.1 400 Bad Request
{"message":"Schema validation failed","timestamp":"2026-09-20T20:43:23.893Z"}
```

In development the error body also carries a `stack` field. It is omitted in production.

## Inspect it

```bash
npx quarry queue:list
npx quarry queue:failed
```

## Key files

- [`src/app.module.ts`](src/app.module.ts) — provider selection
- [`src/notifications/notifications.module.ts`](src/notifications/notifications.module.ts) — `registerQueue()` and the `consumers` array
- [`src/notifications/notifications.controller.ts`](src/notifications/notifications.controller.ts) — dispatching
- [`src/notifications/notification.consumer.ts`](src/notifications/notification.consumer.ts) — consuming

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
