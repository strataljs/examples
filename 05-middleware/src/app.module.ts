import { Module } from 'stratal/module'
import { Router, type RouteConfigurable } from 'stratal/router'
import { HelloController } from './hello/hello.controller'
import { HealthController } from './health/health.controller'
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware'
import { RequestIdMiddleware } from './middleware/request-id.middleware'

@Module({
  controllers: [HelloController, HealthController],
  providers: [RequestLoggerMiddleware, RequestIdMiddleware],
})
export class AppModule implements RouteConfigurable {
  configureRoutes(router: Router): void {
    router.use(RequestIdMiddleware)

    router.group([HelloController], (r) => {
      r.middleware(RequestLoggerMiddleware)
    })
  }
}
