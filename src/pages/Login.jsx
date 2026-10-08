import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

function GoogleMark({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  )
}

export default function Login() {
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('ingresar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={location.state?.from || '/perfil'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      if (tab === 'ingresar') {
        const { error: err } = await signIn(email, password)
        if (err) throw err
      } else {
        const { error: err } = await signUp(email, password)
        if (err) throw err
        setSuccess('¡Cuenta creada! Ya podés usar Patitas.')
      }
      navigate(location.state?.from || '/perfil', { replace: true })
    } catch (err) {
      setError(err.message || 'Ocurrió un error. Probá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogle() {
    setError('')
    setSuccess('')
    try {
      const { error: err } = await signInWithGoogle()
      if (err) throw err
    } catch (err) {
      setError(err.message || 'No pudimos conectar con Google.')
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-full bg-stone-100 p-1">
          {['ingresar', 'crear'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError(''); setSuccess('') }}
              className={`rounded-full py-2 text-sm font-extrabold transition ${
                tab === t ? 'bg-white text-stone-900 shadow' : 'text-stone-500'
              }`}
            >
              {t === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-bold text-stone-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}
          {success && <p className="text-sm font-bold text-brand">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {tab === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-sm text-stone-400">
          <span className="h-px flex-1 bg-stone-200" />
          o continuá con
          <span className="h-px flex-1 bg-stone-200" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-stone-200 px-6 py-2.5 font-extrabold text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
        >
          <GoogleMark />
          Google
        </button>

        <Link
          to="/"
          className="mt-6 block text-center text-sm font-bold text-brand hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
