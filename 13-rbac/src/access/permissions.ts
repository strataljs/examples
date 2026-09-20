import { createAccessControl } from '@stratal/framework/access-control'

export const permissions = createAccessControl({
  resources: {
    articles: ['create', 'read', 'update', 'delete'],
    roles: ['read', 'assign'],
  } as const,
  roles: {
    viewer: { articles: ['read'] },
    editor: { articles: ['create', 'read', 'update'] },
    admin: {
      articles: ['create', 'read', 'update', 'delete'],
      roles: ['read', 'assign'],
    },
  },
})
