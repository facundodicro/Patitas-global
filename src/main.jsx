import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/useAuth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Service worker para la PWA (solo en producción)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Buscar una versión nueva del SW en cada visita (evita quedarse
        // con una versión vieja cacheada de la app)
        if (reg.update) reg.update().catch(() => {})
      })
      .catch(() => {
        /* instalación offline opcional: la app funciona igual sin SW */
      })
  })
}
