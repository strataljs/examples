import { CacheModule } from 'stratal/cache'
import { Module } from 'stratal/module'
import { TaskService } from './services/task.service'

@Module({
  imports: [CacheModule],
  providers: [TaskService],
})
export class AppModule {}
