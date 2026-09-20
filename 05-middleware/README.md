# 05 · Middleware

Registering global and scoped middleware through the Router.

## What it demonstrates

- `RouteConfigurable` on a module, with `configureRoutes(router)`
- `router.use()` for middleware on every route in the app
- `router.group([Controller], r => r.middleware(...))` to scope middleware to specific controllers
- The `Middleware` interface — work before `await next()`, work after it

> Earlier versions of Stratal used `MiddlewareConfigurable` and `MiddlewareConsumer` with `.apply().exclude().forRoutes()`. That API is gone. Middleware is now registered on the `Router`, and instead of excluding paths you scope middleware to the controllers that need it.

## Run it

```bash
npm install
npm run dev
```

## Try it

`RequestIdMiddleware` is global, so every response carries `x-request-id`. `RequestLoggerMiddleware` is scoped to `HelloController` only.

```bash
curl -i http://localhost:8787/api/v1/hello
```

```
HTTP/1.1 200 OK
x-request-id: 3e4d03d7-b4b1-4652-8f2e-a5f238921e5f

{"message":"Hello World"}
```

```bash
curl -i http://localhost:8787/api/v1/health
```

```
HTTP/1.1 200 OK
x-request-id: 97b8f9cf-58dd-46f3-8f98-b63f0383e579

{"status":"ok"}
```

Only the `/hello` request logs through the scoped middleware — check the `wrangler dev` output:

```
--> GET /api/v1/hello
<-- GET /api/v1/hello 200 (4ms)
```

## Key files

- [`src/app.module.ts`](src/app.module.ts) — `configureRoutes()` wiring
- [`src/middleware/request-id.middleware.ts`](src/middleware/request-id.middleware.ts) — global middleware
- [`src/middleware/request-logger.middleware.ts`](src/middleware/request-logger.middleware.ts) — scoped middleware

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
