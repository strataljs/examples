import { QuarryRunner } from 'stratal/quarry/runner'
import { AppModule } from './app.module'
import { AddTaskCommand } from './commands/add-task.command'
import { CompleteTaskCommand } from './commands/complete-task.command'
import { ListTasksCommand } from './commands/list-tasks.command'
import { ResetTasksCommand } from './commands/reset-tasks.command'
import { ShowTaskCommand } from './commands/show-task.command'
import { TagTaskCommand } from './commands/tag-task.command'

export default QuarryRunner.run({
  imports: [AppModule],
  providers: [
    AddTaskCommand,
    ListTasksCommand,
    CompleteTaskCommand,
    ShowTaskCommand,
    TagTaskCommand,
    ResetTasksCommand,
  ],
})
