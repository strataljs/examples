# 07 · Scheduled Tasks

Cron-triggered jobs running on a Worker schedule.

## What it demonstrates

- The `CronJob` interface with `execute()` and an optional `onError()`
- `static schedule` on the job class
- Registering jobs in a module's `jobs` array
- Injecting the framework logger into a job

> `schedule` must be a **static** property. An instance property (`readonly schedule = '...'`) is not read — the job logs a warning at boot and never runs. The string must also match a trigger in [`wrangler.jsonc`](wrangler.jsonc) exactly.

## Run it

```bash
npm install
npm run dev -- --test-scheduled
```

`--test-scheduled` exposes a `/__scheduled` endpoint so you can fire a trigger without waiting for the clock.

## Try it

```bash
curl "http://localhost:8787/__scheduled?cron=*%2F5+*+*+*+*"
curl "http://localhost:8787/__scheduled?cron=0+2+*+*+*"
```

Both return `200`. The jobs log to the `wrangler dev` output:

```
[HeartbeatJob] heartbeat at 2026-09-20T20:44:14.575Z
{"level":"info","message":"[CleanupJob] purging expired records","timestamp":1789937054595}
```

## Inspect it

```bash
npx quarry schedule:list
```

```
Schedule     Job
-----------  ------------
0 2 * * *    CleanupJob
*/5 * * * *  HeartbeatJob
```

## Key files

- [`src/jobs/heartbeat.job.ts`](src/jobs/heartbeat.job.ts) — runs every five minutes
- [`src/jobs/cleanup.job.ts`](src/jobs/cleanup.job.ts) — runs daily, with an error hook
- [`src/jobs/jobs.module.ts`](src/jobs/jobs.module.ts) — the `jobs` array

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
