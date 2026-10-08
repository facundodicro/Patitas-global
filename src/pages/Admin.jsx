import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, LogOut, Trash2, X, PartyPopper } from 'lucide-react'
import Logo from '../components/Logo'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import DonateButton from '../components/DonateButton'
import { useAuth } from '../hooks/useAuth'
import {
  createAd,
  deleteAd,
  listAds,
  listReports,
  updateReportEstado,
} from '../lib/store'

const ESTADOS = ['perdida', 'encontrada', 'en_casa']

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
    </div>
  )
}

function AdminLogin() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { error: err } = await signIn(email, password)
      if (err) throw err
    } catch (err) {
      setError(err.message || 'No pudimos ingresar. Probá de nuevo.')
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
        <h1 className="text-center text-2xl font-extrabold text-stone-900">
          Acceso administrativo
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-sm font-bold text-stone-700">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-1 block text-sm font-bold text-stone-700">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            Ingresar
          </button>
        </form>
      </div>
    </div>
  )
}

function Panel() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('reportes')
  const [reports, setReports] = useState([])
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [adTitulo, setAdTitulo] = useState('')
  const [adDescripcion, setAdDescripcion] = useState('')
  const [adWhatsapp, setAdWhatsapp] = useState('')
  const [savingAd, setSavingAd] = useState(false)
  const [celebrated, setCelebrated] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [reps, adsList] = await Promise.all([listReports(), listAds()])
        if (mounted) {
          setReports(reps)
          setAds(adsList)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  async function handleEstado(id, estado) {
    await updateReportEstado(id, estado)
    setReports((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, estado } : r))
      const changed = updated.find((r) => r.id === id)
      if (estado === 'en_casa' && changed) setCelebrated(changed.nombre)
      return updated
    })
  }

  async function handleCreateAd(e) {
    e.preventDefault()
    setSavingAd(true)
    try {
      const ad = await createAd({
        titulo: adTitulo.trim(),
        descripcion: adDescripcion.trim(),
        whatsapp: adWhatsapp.trim(),
      })
      setAds((prev) => [ad, ...prev])
      setAdTitulo('')
      setAdDescripcion('')
      setAdWhatsapp('')
    } finally {
      setSavingAd(false)
    }
  }

  async function handleDeleteAd(id) {
    await deleteAd(id)
    setAds((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-stone-900">Panel de administración</h1>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 font-extrabold text-stone-700 transition hover:border-stone-400"
        >
          <LogOut className="h-5 w-5" />
          Salir
        </button>
      </div>

      <div className="mt-6 grid w-fit grid-cols-2 rounded-full bg-stone-200/60 p-1">
        {[
          { id: 'reportes', label: 'Reportes' },
          { id: 'publicidades', label: 'Publicidades' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-full px-6 py-2 text-sm font-extrabold transition ${
              tab === t.id ? 'bg-white text-stone-900 shadow' : 'text-stone-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'reportes' && (
        <div className="mt-6 grid gap-4">
          {celebrated && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-status-encontrado/30 bg-status-encontrado/10 px-5 py-4 animate-fade-up">
              <PartyPopper className="h-6 w-6 shrink-0 text-status-encontrado" />
              <p className="min-w-0 flex-1 text-sm font-bold text-stone-700">
                ¡{celebrated} volvió a casa! Otro reencuentro gracias a la red Patitas.
              </p>
              <DonateButton label="Agradecer" />
              <button
                type="button"
                onClick={() => setCelebrated(null)}
                aria-label="Cerrar aviso"
                className="rounded-full p-1.5 text-stone-500 transition hover:bg-stone-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {reports.length === 0 && (
            <EmptyState title="Sin reportes" text="Todavía no hay reportes publicados." />
          )}
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-card"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-extrabold text-stone-900">{r.nombre}</p>
                {r.zona && <p className="text-sm text-stone-500">{r.zona}</p>}
              </div>
              <Badge estado={r.estado} />
              <select
                value={r.estado}
                onChange={(e) => handleEstado(r.id, e.target.value)}
                aria-label={`Estado de ${r.nombre}`}
                className="rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm font-bold text-stone-700 outline-none transition focus:border-brand"
              >
                {ESTADOS.map((e) => (
                  <option key={e} value={e}>
                    {e === 'en_casa' ? 'En casa' : e === 'perdida' ? 'Perdida' : 'Encontrada'}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === 'publicidades' && (
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleCreateAd} className="rounded-2xl bg-white p-6 shadow-card">
            <h2 className="text-lg font-extrabold text-stone-900">Nueva publicidad</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="ad-titulo" className="mb-1 block text-sm font-bold text-stone-700">
                  Título *
                </label>
                <input
                  id="ad-titulo"
                  required
                  value={adTitulo}
                  onChange={(e) => setAdTitulo(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
                />
              </div>
              <div>
                <label htmlFor="ad-descripcion" className="mb-1 block text-sm font-bold text-stone-700">
                  Descripción
                </label>
                <textarea
                  id="ad-descripcion"
                  rows={3}
                  value={adDescripcion}
                  onChange={(e) => setAdDescripcion(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
                />
              </div>
              <div>
                <label htmlFor="ad-whatsapp" className="mb-1 block text-sm font-bold text-stone-700">
                  WhatsApp *
                </label>
                <input
                  id="ad-whatsapp"
                  required
                  value={adWhatsapp}
                  onChange={(e) => setAdWhatsapp(e.target.value)}
                  placeholder="Ej: 5492262000000"
                  className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
                />
              </div>
              <button
                type="submit"
                disabled={savingAd}
                className="flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-extrabold text-white transition hover:bg-accent-dark disabled:opacity-60"
              >
                {savingAd && <Loader2 className="h-5 w-5 animate-spin" />}
                Publicar
              </button>
              <p className="text-xs font-bold text-stone-400">
                Solo el equipo Patitas ve esta sección.
              </p>
            </div>
          </form>

          <div className="space-y-4">
            {ads.length === 0 && (
              <EmptyState title="Sin publicidades" text="Todavía no publicaste anuncios." />
            )}
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-card">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-stone-900">{ad.titulo}</p>
                  {ad.descripcion && (
                    <p className="mt-1 text-sm text-stone-600">{ad.descripcion}</p>
                  )}
                  {ad.whatsapp && (
                    <p className="mt-1 text-sm font-bold text-stone-500">{ad.whatsapp}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteAd(ad.id)}
                  aria-label={`Eliminar ${ad.titulo}`}
                  className="rounded-full p-2 text-status-perdido transition hover:bg-status-perdido/10"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Admin() {
  const { user, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (loading) return <Spinner />
  if (!user) return <AdminLogin />
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="Acceso restringido"
          text="Tu cuenta no tiene permisos de administración."
          actionLabel="Volver al inicio"
          onAction={() => navigate('/')}
        />
      </div>
    )
  }
  return <Panel />
}
