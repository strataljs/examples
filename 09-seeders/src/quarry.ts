import { QuarryRunner } from 'stratal/quarry/runner'
import { AppModule } from './app.module'
import { NotesSeeder } from './seeders/notes.seeder'

export default QuarryRunner.run({
  imports: [AppModule],
  providers: [NotesSeeder],
})
