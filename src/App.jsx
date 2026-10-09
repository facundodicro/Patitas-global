import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import AdBanner from './components/AdBanner'
import ProtectedRoute from './components/ProtectedRoute'
import QrScanner from './components/QrScanner'
import Home from './pages/Home'
import Tablon from './pages/Tablon'
import PetPublic from './pages/PetPublic'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Admin from './pages/Admin'

/** Desplaza a la sección indicada cuando la URL trae #hash (ej: /#como-funciona). */
function ScrollToHash() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        // espera un tick para que la sección exista en el DOM
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
        return
      }
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToHash />
      <Header />
      {/* padding-top por el header fijo + padding-bottom para que el FAB no tape nada */}
      <main className="flex-1 pt-16 pb-28">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tablon" element={<Tablon />} />
          <Route path="/m/:id" element={<PetPublic />} />
          <Route path="/ingresar" element={<Login />} />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <AdBanner />
      <Footer />
      <QrScanner />
    </div>
  )
}
