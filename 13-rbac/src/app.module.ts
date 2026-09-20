import { AuthModule as CoreAuthModule } from '@stratal/framework/auth'
import type { DatabaseService } from '@stratal/framework/database'
import { DatabaseModule } from '@stratal/framework/database'
import type { StratalEnv } from 'stratal'
import { DI_TOKENS } from 'stratal/di'
import { Module } from 'stratal/module'

import { permissions } from './access/permissions'
import { ArticlesModule } from './articles/articles.module'
import { AuthModule } from './auth/auth.module'
import { createAuthOptions } from './auth/auth.config'
import { createDatabaseConfig } from './database/database.config'
import './database/database.types'
import { RolesModule } from './roles/roles.module'

@Module({
  imports: [
    DatabaseModule.forRootAsync({
      inject: [DI_TOKENS.CloudflareEnv],
      useFactory: (env: StratalEnv) => createDatabaseConfig(env),
    }),
    CoreAuthModule.forRootAsync({
      inject: [DI_TOKENS.CloudflareEnv, DI_TOKENS.Database],
      useFactory: (env: StratalEnv, db: DatabaseService<'main'>) => createAuthOptions(env, db),
      accessControl: permissions,
    }),
    AuthModule,
    ArticlesModule,
    RolesModule,
  ],
})
export class AppModule {}
