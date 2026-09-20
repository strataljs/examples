import { Stratal } from 'stratal'
import { AppModule } from './app.module'

export { TaskCounter } from './task/task-counter'
export { TaskRpc } from './task/task-rpc'
export { TaskWorkflow } from './task/task-workflow'

export default new Stratal({
  module: AppModule,
  versioning: { prefix: 'api/v', defaultVersion: '1' },
})
