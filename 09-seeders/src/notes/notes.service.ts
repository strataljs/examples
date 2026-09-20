import { CACHE_TOKENS, type CacheService } from 'stratal/cache'
import { inject, Transient } from 'stratal/di'
import type { CreateNoteInput, Note } from './notes.schemas'

const KEY_PREFIX = 'note:'

@Transient()
export class NotesService {
  constructor(@inject(CACHE_TOKENS.CacheService) private readonly cache: CacheService) {}

  async findAll(): Promise<Note[]> {
    const { keys } = await this.cache.list({ prefix: KEY_PREFIX })
    const notes = await Promise.all(keys.map((key) => this.cache.get<Note>(key.name, 'json')))
    return notes.filter((note): note is Note => note !== null)
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString()
    const note: Note = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now }

    await this.cache.put(`${KEY_PREFIX}${note.id}`, JSON.stringify(note))
    return note
  }
}
