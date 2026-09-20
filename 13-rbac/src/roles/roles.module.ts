import { Module } from 'stratal/module'
import { MyAccessController } from './roles.controller'

@Module({
  controllers: [MyAccessController],
})
export class RolesModule {}
