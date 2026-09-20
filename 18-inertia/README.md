# 18 · Inertia

A server-driven React app: Inertia.js v3 with streamed SSR, typed page props, prop helpers, flash messages, and i18n.

## What it demonstrates

- `InertiaModule.forRoot()` with a root view, SSR bundle, flash store, shared data and i18n
- `@InertiaGet` / `@InertiaPost` / `@InertiaPut` / `@InertiaDelete` returning `ctx.inertia('Page', props)`
- Prop helpers — `ctx.defer()`, `ctx.merge()`, `ctx.optional()`, `ctx.once()`, `ctx.always()`
- Flash messages via `ctx.flash()` and a cookie-backed store
- Page props typed from the controller by `quarry inertia:types`
- Streamed SSR through `createInertiaSsrApp` from `@stratal/inertia/ssr`
- Frontend translations with `useI18n()`, scoped to a shared namespace

## Run it

```bash
npm install
npm run dev
```

`npm run dev` is `quarry inertia:dev`, which runs Vite and the Worker together. Build with `npm run build`.

Notes live in the `NOTES` KV namespace, so they survive restarts of the local dev server.

## Try it

Open the printed URL. The pages are server-rendered on first paint, then hydrated:

```bash
curl -s http://localhost:8787/ | grep -o 'Hello from Stratal'
```

Ask for the Inertia payload instead of HTML:

```bash
curl -s http://localhost:8787/notes \
  -H 'X-Inertia: true' -H 'X-Inertia-Version: 1.0.0'
```

```
component: notes/Index
props: ['appName', 'categories', 'errors', 'locale', 'notes', 'page', 'seo', 'timestamp', 'translations']
```

`stats` is missing above because it is an `optional()` prop — it ships only when asked for. A partial reload returns it, together with the `always()` props:

```bash
curl -s http://localhost:8787/notes \
  -H 'X-Inertia: true' -H 'X-Inertia-Version: 1.0.0' \
  -H 'X-Inertia-Partial-Component: notes/Index' \
  -H 'X-Inertia-Partial-Data: stats'
```

```
props: ['errors', 'seo', 'stats', 'timestamp']
```

Creating a note redirects, the Inertia way:

```bash
curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:8787/notes \
  -H 'Content-Type: application/json' -H 'X-Inertia: true' -H 'X-Inertia-Version: 1.0.0' \
  -d '{"title":"Inertia note","content":"Created over the Inertia protocol"}'
```

```
303
```

## Typed page props

`ctx.inertia('Dashboard', { stats, activeUsers })` in the controller is enough — the generator reads the call and writes the matching type:

```bash
npx quarry inertia:types
```

```
✔ Generated src/inertia/inertia.d.ts (6 pages)
```

`src/inertia/inertia.d.ts` is generated and gitignored. Regenerate it after changing a controller's props.

## Inspect it

Inertia routes are hidden from the route table by default, so pass `--hidden`:

```bash
npx quarry route:list --hidden
```

```
Method  Path             Handler
------  ---------------  --------------------------
GET     /                HomeController.index
GET     /dashboard       DashboardController.index
GET     /notes           NotesController.index
POST    /notes           NotesController.create
GET     /notes/:id       NotesController.show
PUT     /notes/:id       NotesController.update
DELETE  /notes/:id       NotesController.destroy
```

## Key files

- [`src/app.module.ts`](src/app.module.ts) — `InertiaModule.forRoot()`
- [`src/inertia/ssr.tsx`](src/inertia/ssr.tsx) — SSR entry
- [`src/inertia/app.tsx`](src/inertia/app.tsx) — client entry
- [`src/notes/notes.controller.ts`](src/notes/notes.controller.ts) — prop helpers and flash
- [`src/inertia/pages/`](src/inertia/pages/) — the React pages
- [`src/i18n/messages.ts`](src/i18n/messages.ts) — messages plus the namespace augmentation that types `t()`

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
