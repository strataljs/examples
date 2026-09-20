# 13 · Access Control

Role-based permissions on top of Better Auth, enforced by guards.

## What it demonstrates

- `createAccessControl()` to declare resources, actions, and roles in one place
- `accessControl` on `AuthModule.forRootAsync()` to turn on enforcement
- `@UseGuards(AuthGuard({ permissions: 'articles:create' }))` per route
- `AccessService.getCurrentUserPermissions()` to read what the signed-in user may do
- Better Auth's `admin()` plugin supplying the `role` field, with `defaultRole: 'viewer'`

> Earlier versions of this example used Casbin through `@stratal/framework/rbac`. That module is gone. Roles and permissions are now declared with `createAccessControl()` and stored on the user record, so there is no policy table and no enforcer to seed.

## Run it

```bash
npm install
npm run setup
npm run dev
```

`setup` starts Postgres (port `6433`), generates the ZenStack client, and pushes the schema. Stop it with `npm run db:down`.

## The roles

```ts
roles: {
  viewer: { articles: ['read'] },
  editor: { articles: ['create', 'read', 'update'] },
  admin:  { articles: ['create', 'read', 'update', 'delete'], roles: ['read', 'assign'] },
}
```

## Try it

New accounts get `viewer`:

```bash
curl -X POST http://localhost:8787/api/auth/sign-up/email \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:8787' \
  -d '{"email":"viewer@example.com","password":"supersecret123","name":"Vi Ewer"}' \
  -c viewer.txt

curl http://localhost:8787/api/v1/me -b viewer.txt
```

```json
{"data":{"role":"viewer","permissions":{"articles":["read"]}}}
```

A viewer can read but not create:

```bash
curl http://localhost:8787/api/v1/articles -b viewer.txt                  # 200
curl -i -X POST http://localhost:8787/api/v1/articles -b viewer.txt \
  -H 'Content-Type: application/json' -H 'Origin: http://localhost:8787' \
  -d '{"title":"Nope","content":"Should fail"}'
```

```
HTTP/1.1 403 Forbidden
{"message":"Insufficient permissions","timestamp":"2026-09-20T21:23:48.579Z"}
```

Promote someone to `editor` and sign in again:

```bash
docker exec 13-rbac-postgres-1 psql -U stratal -d stratal_rbac_example \
  -c "UPDATE \"User\" SET role='editor' WHERE email='editor@example.com';"
```

```json
{"data":{"role":"editor","permissions":{"articles":["create","read","update"]}}}
```

An editor can create but not delete:

```
POST   /api/v1/articles      201
DELETE /api/v1/articles/<id> 403
```

An `admin` gets everything:

```json
{"data":{"role":"admin","permissions":{"articles":["create","read","update","delete"],"roles":["read","assign"]}}}
```

```bash
curl -X DELETE http://localhost:8787/api/v1/articles/<id> -b admin.txt   # {"success":true}
```

## Key files

- [`src/access/permissions.ts`](src/access/permissions.ts) — resources, actions, roles
- [`src/auth/auth.config.ts`](src/auth/auth.config.ts) — Better Auth with the `admin()` plugin
- [`src/articles/articles.controller.ts`](src/articles/articles.controller.ts) — per-route permission guards
- [`src/roles/roles.controller.ts`](src/roles/roles.controller.ts) — reads the caller's own permissions

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
