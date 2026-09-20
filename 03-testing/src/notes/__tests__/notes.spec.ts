import { Test, type TestingModule } from '@stratal/testing'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { NotesModule } from '../notes.module'
import { NotesService } from '../notes.service'

describe('NotesController', () => {
  let module: TestingModule

  beforeEach(async () => {
    NotesService.reset()
    module = await Test.createTestingModule({
      imports: [NotesModule],
      // Mirrors src/index.ts — the testing module builds its own application and
      // never runs the entry file, so omitting this would assert unversioned URLs.
      versioning: { prefix: 'api/v', defaultVersion: '1' },
    }).compile()
  })

  afterAll(async () => {
    await module.close()
  })

  const createNote = (title: string, content = 'Content') =>
    module.http.post('/api/v1/notes').withBody({ title, content }).send()

  it('creates a note', async () => {
    const response = await createNote('Test Note', 'Hello from tests')

    response.assertCreated()
    await response.assertJsonPath('data.title', 'Test Note')
    await response.assertJsonPath('data.content', 'Hello from tests')
    await response.assertJsonPathExists('data.id')
  })

  it('lists all notes', async () => {
    await createNote('Note 1', 'First')
    await createNote('Note 2', 'Second')

    const response = await module.http.get('/api/v1/notes').send()

    response.assertOk()
    await response.assertJsonPathCount('data', 2)
  })

  it('gets a note by id', async () => {
    const created = await (await createNote('Find Me')).json<{ data: { id: string } }>()

    const response = await module.http.get(`/api/v1/notes/${created.data.id}`).send()

    response.assertOk()
    await response.assertJsonPath('data.title', 'Find Me')
  })

  it('updates a note', async () => {
    const created = await (await createNote('Original')).json<{ data: { id: string } }>()

    const response = await module.http
      .put(`/api/v1/notes/${created.data.id}`)
      .withBody({ title: 'Updated' })
      .send()

    response.assertOk()
    await response.assertJsonPath('data.title', 'Updated')
  })

  it('deletes a note', async () => {
    const created = await (await createNote('Delete Me')).json<{ data: { id: string } }>()

    const response = await module.http.delete(`/api/v1/notes/${created.data.id}`).send()

    response.assertOk()
    await response.assertJsonPath('success', true)
  })

  it('returns 404 for a note that does not exist', async () => {
    const response = await module.http.get('/api/v1/notes/non-existent').send()

    response.assertNotFound()
  })

  it('rejects a body that fails validation', async () => {
    const response = await module.http.post('/api/v1/notes').withBody({ title: '' }).send()

    response.assertBadRequest()
  })

  it('resolves NotesService from the container', () => {
    expect(module.get(NotesService).findAll()).toEqual([])
  })
})
