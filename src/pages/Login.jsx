import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2, MailCheck } from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const {
    user,
    loading,
    signUp,
    resendConfirmation,
    signIn,
    recoveryMode,
    resetPassword,
    updatePassword,
  } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [tab, setTab] = useState('ingresar')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const destino = location.state?.from || '/panel'

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    )
  }

  /* El usuario abrió el enlace de recuperación del email: pedir nueva contraseña */
  if (recoveryMode) {
    return (
      <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
        <div className="rounded-3xl bg-white p-8 shadow-card">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <h1 className="text-center text-2xl font-extrabold text-stone-900">
            Nueva contraseña
          </h1>
          <p className="mt-2 text-center text-sm text-stone-500">
            Elegí una contraseña nueva para tu cuenta.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              setError('')
              setSuccess('')
              if (password !== password2) {
                setError('Las contraseñas no coinciden.')
                return
              }
              setSubmitting(true)
              try {
                await updatePassword(password)
                setSuccess('¡Contraseña actualizada! Ya podés ingresar.')
                setTimeout(() => navigate('/panel', { replace: true }), 1200)
              } catch (err) {
                setError(err.message || 'No pudimos actualizarla. Probá de nuevo.')
              } finally {
                setSubmitting(false)
              }
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <label htmlFor="new-password" className="mb-1 block text-sm font-bold text-stone-700">
                Nueva contraseña
              </label>
              <input
                id="new-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div>
              <label htmlFor="new-password2" className="mb-1 block text-sm font-bold text-stone-700">
                Repetila
              </label>
              <input
                id="new-password2"
                type="password"
                required
                minLength={6}
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
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
              Guardar contraseña
            </button>
          </form>
        </div>
      </div>
    )
  }

  /* La cuenta quedó creada pero falta confirmar el correo */
  if (pendingEmail) {
    return (
      <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
        <div className="rounded-3xl bg-white p-8 text-center shadow-card">
          <div className="mb-6 flex justify-center">
            <Logo />
          </div>
          <MailCheck className="mx-auto h-12 w-12 text-brand" />
          <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
            Revisá tu correo
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Te mandamos un mensaje a <strong>{pendingEmail}</strong> con un
            enlace para activar tu cuenta. Tocá el enlace y volvés a Patitas ya
            ingresado.
          </p>
          <p className="mt-3 text-sm text-stone-500">
            ¿No llegó? Mirá en spam o correo no deseado. Si pasan unos minutos
            y no aparece, te lo reenviamos:
          </p>
          {error && <p className="mt-4 text-sm font-bold text-status-perdido">{error}</p>}
          {resent && (
            <p className="mt-4 text-sm font-bold text-brand">
              ¡Listo! Te reenviamos el correo de confirmación.
            </p>
          )}
          <button
            type="button"
            disabled={resending}
            onClick={async () => {
              setError('')
              setResent(false)
              setResending(true)
              try {
                await resendConfirmation(pendingEmail, destino)
                setResent(true)
              } catch (err) {
                setError(err.message || 'No pudimos reenviarlo. Probá de nuevo en un rato.')
              } finally {
                setResending(false)
              }
            }}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {resending && <Loader2 className="h-5 w-5 animate-spin" />}
            Reenviar el correo
          </button>
          <button
            type="button"
            onClick={() => { setPendingEmail(''); setTab('ingresar'); setError(''); setResent(false) }}
            className="mt-4 w-full text-center text-sm font-bold text-stone-500 hover:underline"
          >
            Ya lo confirmé, quiero ingresar
          </button>
        </div>
      </div>
    )
  }

  if (user) {
    return <Navigate to={location.state?.from || '/panel'} replace />
  }

  const isRecover = tab === 'recuperar'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      if (isRecover) {
        await resetPassword(email)
        setSuccess('Te enviamos un email con el enlace para crear una contraseña nueva.')
      } else if (tab === 'ingresar') {
        await signIn(email, password)
        navigate(destino, { replace: true })
      } else {
        const res = await signUp(email, password, destino)
        if (res?.pendingConfirmation) {
          setPendingEmail(email)
          setResent(false)
        } else {
          setSuccess('¡Cuenta creada! Ya podés usar Patitas.')
          navigate(destino, { replace: true })
        }
      }
    } catch (err) {
      if (err?.message && /email not confirmed/i.test(err.message)) {
        // La cuenta existe pero el correo todavía no fue confirmado.
        setPendingEmail(email)
        setResent(false)
        setError('')
      } else {
        setError(err.message || 'Ocurrió un error. Probá de nuevo.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        {isRecover ? (
          <p className="mb-6 text-center text-sm text-stone-500">
            Ingresá tu email y te enviamos un enlace para crear una contraseña nueva.
          </p>
        ) : (
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
        )}

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
          {!isRecover && (
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
              {tab === 'ingresar' && (
                <button
                  type="button"
                  onClick={() => { setTab('recuperar'); setError(''); setSuccess('') }}
                  className="mt-2 text-sm font-bold text-brand hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </div>
          )}

          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}
          {success && <p className="text-sm font-bold text-brand">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {isRecover ? 'Enviar enlace' : tab === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}
          </button>

          {isRecover && (
            <button
              type="button"
              onClick={() => { setTab('ingresar'); setError(''); setSuccess('') }}
              className="w-full text-center text-sm font-bold text-stone-500 hover:underline"
            >
              Volver a ingresar
            </button>
          )}
        </form>

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
