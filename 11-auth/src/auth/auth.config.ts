import { kyselyAdapter } from '@better-auth/kysely-adapter'
import type { BetterAuthOptions } from 'better-auth'
import { Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'
import type { StratalEnv } from 'stratal'

export function createAuthOptions(env: StratalEnv): BetterAuthOptions {
  return {
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    database: kyselyAdapter(new Kysely({ dialect: new D1Dialect({ database: env.DB }) }), {
      type: 'sqlite',
      // D1 has no interactive transactions.
      transaction: false,
    }),
    advanced: {
      database: {
        // Schema validation reads sqlite_master, which D1 rejects with SQLITE_AUTH.
        // The tables come from migrations/ instead.
        validateSchema: false,
      },
    },
    emailAndPassword: {
      enabled: true,
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
    },
  }
}
