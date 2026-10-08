import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured, adminEmails } from '../lib/supabase'

const AuthContext = createContext(null)
const LS_AUTH = 'patitas_demo_auth'

/**
 * Sesión de usuario.
 * - Con Supabase: usa Supabase Auth (email/contraseña + Google OAuth).
 * - Sin Supabase (modo demo): sesión local en localStorage para probar los flujos.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      return () => sub.subscription.unsubscribe()
    }
    try {
      const raw = localStorage.getItem(LS_AUTH)
      setUser(raw ? JSON.parse(raw) : null)
    } catch {
      setUser(null)
    }
    setLoading(false)
    return undefined
  }, [])

  const persistDemo = (u) => {
    setUser(u)
    try {
      if (u) localStorage.setItem(LS_AUTH, JSON.stringify(u))
      else localStorage.removeItem(LS_AUTH)
    } catch {
      /* noop */
    }
  }

  const validateDemoCredentials = (email, password) => {
    if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Ingresá un email válido.')
    if (!password || password.length < 6)
      throw new Error('La contraseña tiene que tener al menos 6 caracteres.')
  }

  const signUp = useCallback(async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      return data.user
    }
    validateDemoCredentials(email, password)
    const u = { id: `demo-user-${Date.now()}`, email }
    persistDemo(u)
    return u
  }, [])

  const signIn = useCallback(async (email, password) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data.user
    }
    validateDemoCredentials(email, password)
    // En modo demo cualquier credencial válida inicia sesión local
    const u = { id: `demo-user-${email}`, email }
    persistDemo(u)
    return u
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
      if (error) throw error
      return
    }
    const u = { id: `demo-google-${Date.now()}`, email: 'usuario.demo@gmail.com' }
    persistDemo(u)
    return u
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
      setUser(null)
      return
    }
    persistDemo(null)
  }, [])

  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()))

  return (
    <AuthContext.Provider
      value={{ user, loading, signUp, signIn, signInWithGoogle, signOut, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
