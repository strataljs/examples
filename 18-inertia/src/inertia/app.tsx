import './styles/global.css'

import { createInertiaApp } from '@inertiajs/react'
import type { FunctionComponent } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

const pages = import.meta.glob('./pages/**/*.tsx', { eager: false }) as Record<
  string,
  () => Promise<FunctionComponent>
>

createInertiaApp({
  resolve: (name: string) => {
    const page = pages[`./pages/${name}.tsx`]?.()
    if (!page) throw new Error(`Page not found: ${name}`)
    return page
  },
  setup({ el, App, props }) {
    const app = <App {...props} />

    if (el!.hasAttribute('data-server-rendered')) {
      hydrateRoot(el!, app)
    } else {
      createRoot(el!).render(app)
    }
  },
}).catch((error) => console.error(error))
