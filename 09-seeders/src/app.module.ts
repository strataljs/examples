import { CacheModule } from 'stratal/cache'
import { Module } from 'stratal/module'
import { NotesController } from './notes/notes.controller'
import { NotesService } from './notes/notes.service'

@Module({
  imports: [CacheModule],
  providers: [NotesService],
  controllers: [NotesController],
})
export class AppModule {}
