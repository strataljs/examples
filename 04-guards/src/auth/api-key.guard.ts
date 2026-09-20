import type { StratalEnv } from 'stratal'
import { DI_TOKENS, inject, Transient } from 'stratal/di'
import type { CanActivate } from 'stratal/guards'
import { HttpException } from 'stratal/errors'
import type { RouterContext } from 'stratal/router'

@Transient()
export class ApiKeyGuard implements CanActivate {
  constructor(@inject(DI_TOKENS.CloudflareEnv) private readonly env: StratalEnv) {}

  canActivate(context: RouterContext): boolean {
    // A missing key is unauthenticated (401); a wrong key is a refusal (403),
    // which the framework raises for us when canActivate returns false.
    const apiKey = context.header('x-api-key')
    if (!apiKey) throw new HttpException(401, 'Missing x-api-key header')
    return apiKey === this.env.API_KEY
  }
}
