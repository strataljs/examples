import './styles/global.css'

import { createInertiaSsrApp } from '@stratal/inertia/ssr'
import type { FunctionComponent } from 'react'

const pages = import.meta.glob('./pages/**/*.tsx', { eager: false }) as Record<
  string,
  () => Promise<FunctionComponent>
>

export const { render } = createInertiaSsrApp({
  resolve: (name: string) => {
    const page = pages[`./pages/${name}.tsx`]?.()
    if (!page) throw new Error(`Page not found: ${name}`)
    return page
  },
})
