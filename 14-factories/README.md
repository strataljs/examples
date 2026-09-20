# 14 · Factories

Generating realistic test data with Faker-backed factories, state modifiers, and sequences.

## What it demonstrates

- `Factory<TModel, TCreateInput>` with a `definition()` of default attributes
- `this.faker` for realistic values
- `Sequence` for values that must be unique across generated records
- State modifiers (`admin()`, `expensive()`, `inCategory()`) that compose
- `count(n).makeMany()` to build in bulk without touching a database

## Run it

```bash
npm install
npm run dev
```

## Try it

```bash
curl "http://localhost:8787/api/v1/demo/users?count=2"
```

```json
{"data":[{"email":"user1@example.com","name":"Lelia Armstrong","role":"user","emailVerified":true},{"email":"user2@example.com","name":"Dr. Jalen Blick","role":"user","emailVerified":true}]}
```

A state modifier changes one facet and leaves the rest alone. The email sequence keeps counting:

```bash
curl "http://localhost:8787/api/v1/demo/admins?count=2"
```

```
Miss Alvina Heaney | admin | user3@example.com
Colton Adams III   | admin | user4@example.com
```

```bash
curl "http://localhost:8787/api/v1/demo/expensive-products?count=2"
```

```
SKU-000001 | Elegant Bronze Salad     | $1503.69
SKU-000002 | Ergonomic Silk Computer  | $3055.25
```

States compose — `expensive().inCategory('Electronics')`:

```bash
curl http://localhost:8787/api/v1/demo/mixed
```

```
users:    [(admin, verified), (admin, verified), (user, unverified) × 3]
products: [(Electronics, in stock) × 2, (Sports, out of stock), (Music, out of stock)]
```

`makeMany()` builds objects in memory. To persist them, use `createMany(db)` or `createManyAndReturn(db)` with a database context — see [12 · database](../12-database/).

## Key files

- [`src/factories/user.factory.ts`](src/factories/user.factory.ts) — sequence + states
- [`src/factories/product.factory.ts`](src/factories/product.factory.ts) — composable states
- [`src/demo/demo.controller.ts`](src/demo/demo.controller.ts) — endpoints exercising them

## Learn more

- [Stratal documentation](https://stratal.dev)
- [Stratal on GitHub](https://github.com/strataljs/stratal)
- [All examples](https://github.com/strataljs/examples)

## Star Stratal

If this example helped, please [star the Stratal repo](https://github.com/strataljs/stratal) — it is the simplest way to support the project and helps other developers find it.
