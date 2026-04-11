import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <TanStackDevtools plugins={[
      {
        name: "Tanstack Query",
        render: <ReactQueryDevtoolsPanel />
      }
    ]} />
  </StrictMode>,
)

const preloader = document.getElementById("preloader")
if (preloader) {
  preloader.style.opacity = "0"
  preloader.style.transition = "opacity 0.4s ease-in-out"
  preloader.style.pointerEvents = "none"
  setTimeout(() => {
    preloader.remove()
  }, 400)
}