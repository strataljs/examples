import { Controller, type IController, Route, type RouterContext } from 'stratal/router'

import { ProductFactory } from '../factories/product.factory'
import { UserFactory } from '../factories/user.factory'
import {
  countQuerySchema,
  mixedResponseSchema,
  productsResponseSchema,
  usersResponseSchema,
} from './demo.schemas'

@Controller('/demo/users')
export class DemoUsersController implements IController {
  @Route({
    query: countQuerySchema,
    response: usersResponseSchema,
    summary: 'Generate fake users',
  })
  index(ctx: RouterContext) {
    const count = parseInt(ctx.query('count') ?? '5', 10)
    const users = new UserFactory().count(count).makeMany()
    return ctx.json({ data: users })
  }
}

@Controller('/demo/admins')
export class DemoAdminsController implements IController {
  @Route({
    query: countQuerySchema,
    response: usersResponseSchema,
    summary: 'Generate fake admin users',
  })
  index(ctx: RouterContext) {
    const count = parseInt(ctx.query('count') ?? '3', 10)
    const admins = new UserFactory().admin().count(count).makeMany()
    return ctx.json({ data: admins })
  }
}

@Controller('/demo/products')
export class DemoProductsController implements IController {
  @Route({
    query: countQuerySchema,
    response: productsResponseSchema,
    summary: 'Generate fake products',
  })
  index(ctx: RouterContext) {
    const count = parseInt(ctx.query('count') ?? '5', 10)
    const products = new ProductFactory().count(count).makeMany()
    return ctx.json({ data: products })
  }
}

@Controller('/demo/expensive-products')
export class DemoExpensiveProductsController implements IController {
  @Route({
    query: countQuerySchema,
    response: productsResponseSchema,
    summary: 'Generate expensive products',
  })
  index(ctx: RouterContext) {
    const count = parseInt(ctx.query('count') ?? '3', 10)
    const products = new ProductFactory().expensive().count(count).makeMany()
    return ctx.json({ data: products })
  }
}

@Controller('/demo/mixed')
export class DemoMixedController implements IController {
  @Route({
    response: mixedResponseSchema,
    summary: 'Generate mixed data with chained states',
  })
  index(ctx: RouterContext) {
    const users = [
      ...new UserFactory().admin().count(2).makeMany(),
      ...new UserFactory().unverified().count(3).makeMany(),
    ]

    const products = [
      ...new ProductFactory().expensive().inCategory('Electronics').count(2).makeMany(),
      ...new ProductFactory().outOfStock().count(2).makeMany(),
    ]

    return ctx.json({ data: { users, products } })
  }
}
