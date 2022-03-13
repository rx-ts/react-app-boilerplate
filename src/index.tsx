import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { App } from './App'

const container = document.querySelector('#app')!

const root = createRoot(container)

root.render(
  process.env.NODE_ENV === 'development' ? (
    <StrictMode>
      <App />
    </StrictMode>
  ) : (
    <App />
  ),
)
