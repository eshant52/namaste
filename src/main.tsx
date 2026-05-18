import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppProvider from './provider/AppProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider />
  </StrictMode>,
)

const preloader = document.getElementById("preloader")

if (preloader) {
  preloader.style.opacity = "0"
  preloader.style.pointerEvents = "none"
  setTimeout(() => {
    preloader.remove()
  }, 400)
}