import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured, adminEmails } from '../lib/supabase'

const AuthContext = createContext(null)
const LS_AUTH = 'patitas_demo_auth'

/**
 * Sesión de usuario.
 * - Con Supabase: usa Supabase Auth (email/contraseña).
 * - Sin Supabase (modo demo): sesión local en localStorage para probar los flujos.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recoveryMode, setRecoveryMode] = useState(false)

  useEffect(() => {
    if (isSupabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
        setRecoveryMode(event === 'PASSWORD_RECOVERY')
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

  const signUp = useCallback(async (email, password, redirectPath) => {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectPath || '/panel'}`,
        },
      })
      if (error) throw error
      // Con la confirmación por email activada, signUp no devuelve sesión:
      // la cuenta queda pendiente hasta que el usuario abre el enlace del correo.
      return {
        user: data.user,
        session: data.session,
        pendingConfirmation: !data.session,
      }
    }
    validateDemoCredentials(email, password)
    const u = { id: `demo-user-${Date.now()}`, email }
    persistDemo(u)
    return { user: u, session: { user: u }, pendingConfirmation: false }
  }, [])

  /** Reenvía el correo de confirmación de registro. */
  const resendConfirmation = useCallback(async (email, redirectPath) => {
    if (!isSupabaseConfigured) {
      throw new Error('No está disponible en modo demo.')
    }
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}${redirectPath || '/panel'}`,
      },
    })
    if (error) throw error
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

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
      setUser(null)
      return
    }
    persistDemo(null)
  }, [])

  const isAdmin = Boolean(user?.email && adminEmails.includes(user.email.toLowerCase()))

  /** Envía el email de recuperación de contraseña. */
  const resetPassword = useCallback(async (email) => {
    if (!isSupabaseConfigured) {
      throw new Error('La recuperación no está disponible en modo demo.')
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/ingresar`,
    })
    if (error) throw error
  }, [])

  /** Define la nueva contraseña tras abrir el enlace de recuperación. */
  const updatePassword = useCallback(async (newPassword) => {
    if (!isSupabaseConfigured) {
      throw new Error('La recuperación no está disponible en modo demo.')
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
    setRecoveryMode(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        resendConfirmation,
        signIn,
        signOut,
        isAdmin,
        recoveryMode,
        resetPassword,
        updatePassword,
      }}
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
