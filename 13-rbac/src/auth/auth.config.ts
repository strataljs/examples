import type { DatabaseService } from '@stratal/framework/database'
import { zenstackAdapter } from '@zenstackhq/better-auth'
import type { BetterAuthOptions } from 'better-auth'
import { admin } from 'better-auth/plugins'
import type { StratalEnv } from 'stratal'
import type { SchemaType } from '../../db/zenstack/schema'
import { permissions } from '../access/permissions'

export function createAuthOptions(env: StratalEnv, db: DatabaseService<'main'>): BetterAuthOptions {
  return {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    // The schema is named rather than inferred: inferring it walks DatabaseService
    // against ClientContract<Schema> and exceeds the checker's stack depth.
    database: zenstackAdapter<SchemaType>(db, { provider: 'postgresql' }),
    emailAndPassword: { enabled: true },
    trustedOrigins: [env.BETTER_AUTH_URL],
    plugins: [admin({ ...permissions, defaultRole: 'viewer' })],
  }
}
