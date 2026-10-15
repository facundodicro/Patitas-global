import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CalendarDays,
  Loader2,
  MessageCircle,
  Pencil,
  Phone,
  Plus,
  QrCode,
  Stethoscope,
  Trash2,
  X,
} from 'lucide-react'
import PetPhoto from '../components/PetPhoto'
import EmptyState from '../components/EmptyState'
import PetFormModal from '../components/PetFormModal'
import QrPlateModal from '../components/QrPlateModal'
import { useAuth } from '../hooks/useAuth'
import {
  createAtencion,
  deleteAtencion,
  deletePet,
  getMyVeterinaria,
  getPetWithVeterinaria,
  listAtenciones,
} from '../lib/store'
import { waLink } from '../lib/qr'

const TIPOS = [
  { value: 'vacuna', label: 'Vacuna', cls: 'bg-emerald-100 text-emerald-800' },
  { value: 'tratamiento', label: 'Tratamiento', cls: 'bg-amber-100 text-amber-800' },
  { value: 'visita', label: 'Visita', cls: 'bg-sky-100 text-sky-800' },
  { value: 'cirugia', label: 'Cirugía', cls: 'bg-rose-100 text-rose-800' },
  { value: 'otro', label: 'Otro', cls: 'bg-stone-200 text-stone-700' },
]

const tipoMeta = (t) => TIPOS.find((x) => x.value === t) ?? TIPOS[TIPOS.length - 1]

function formatFecha(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

function AtencionModal({ open, onClose, onSaved, mascotaId, veterinariaId }) {
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0, 10))
  const [tipo, setTipo] = useState('vacuna')
  const [titulo, setTitulo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [proximaFecha, setProximaFecha] = useState('')
  const [notas, setNotas] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!titulo.trim()) {
      setError('Poné un título para la atención.')
      return
    }
    setSubmitting(true)
    try {
      await createAtencion({
        mascota_id: mascotaId,
        veterinaria_id: veterinariaId,
        fecha,
        tipo,
        titulo: titulo.trim(),
        detalle: detalle.trim(),
        proxima_fecha: proximaFecha || null,
        notas: notas.trim(),
      })
      onSaved?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'No se pudo guardar. Probá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition'
  const labelCls = 'block text-sm font-bold text-stone-700 mb-1.5'

  return (
    <div
      className="fixed inset-0 z-[60] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-pop w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-extrabold text-stone-900">Nueva atención</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-2 text-stone-400 hover:text-stone-700 transition"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Fecha *</label>
              <input
                type="date"
                required
                className={inputCls}
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>Tipo *</label>
              <select className={inputCls} value={tipo} onChange={(e) => setTipo(e.target.value)}>
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Título *</label>
            <input
              className={inputCls}
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: Vacuna antirrábica"
              required
            />
          </div>

          <div>
            <label className={labelCls}>Detalle</label>
            <textarea
              className={inputCls + ' min-h-[80px] resize-y'}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Dosis, observaciones, estado del paciente…"
            />
          </div>

          <div>
            <label className={labelCls}>Próxima fecha</label>
            <input
              type="date"
              className={inputCls}
              value={proximaFecha}
              onChange={(e) => setProximaFecha(e.target.value)}
            />
            <p className="mt-1.5 text-xs text-stone-500">
              Si es una vacuna o tratamiento con refuerzo, cargá cuándo toca.
            </p>
          </div>

          <div>
            <label className={labelCls}>Notas internas</label>
            <textarea
              className={inputCls + ' min-h-[60px] resize-y'}
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Solo visible para la veterinaria"
            />
          </div>

          {error && (
            <p className="text-sm font-bold text-status-perdido bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand hover:bg-brand-light text-white font-extrabold py-3 text-base shadow-card transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {submitting ? 'Guardando…' : 'Guardar atención'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function PetPublic() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isVet, setIsVet] = useState(false)
  const [atenciones, setAtenciones] = useState([])
  const [atencionModal, setAtencionModal] = useState(false)
  const [petModal, setPetModal] = useState(false)
  const [qrModal, setQrModal] = useState(false)
  // id de atención en confirmación, o 'pet' para eliminar el paciente
  const [confirming, setConfirming] = useState(null)

  async function refresh() {
    const result = await getPetWithVeterinaria(id)
    setData(result)
    if (result?.pet) {
      setAtenciones(await listAtenciones(result.pet.id))
    }
    if (user && result?.pet?.veterinaria_id) {
      const mine = await getMyVeterinaria(user.id).catch(() => null)
      setIsVet(!!mine && mine.id === result.pet.veterinaria_id)
    } else {
      setIsVet(false)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        await refresh()
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user])

  async function handleDeleteAtencion(atId) {
    await deleteAtencion(atId)
    setAtenciones((prev) => prev.filter((a) => a.id !== atId))
    setConfirming(null)
  }

  async function handleDeletePet() {
    await deletePet(pet.id)
    navigate('/panel')
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          title="No encontramos esta ficha"
          text="El enlace puede estar desactualizado."
        />
      </div>
    )
  }

  const { pet, veterinaria } = data

  /* ------------------------- VISTA PÚBLICA ------------------------- */
  if (!isVet) {
    const whatsappHref = veterinaria?.whatsapp
      ? waLink(
          veterinaria.whatsapp,
          `¡Hola! Encontré a ${pet.nombre}, escaneé su QR de Patitas.`,
        )
      : null

    return (
      <div className="mx-auto max-w-2xl animate-fade-up px-4 py-8">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <PetPhoto src={pet.foto_url} alt={pet.nombre} className="h-72 w-full object-cover" />
          <div className="p-6">
            <h1 className="text-3xl font-extrabold text-stone-900">{pet.nombre}</h1>
            {(pet.especie || pet.edad) && (
              <p className="mt-1 text-stone-600">
                {[pet.especie, pet.edad].filter(Boolean).join(' · ')}
              </p>
            )}
            {veterinaria && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-1.5 text-sm font-extrabold text-brand-dark">
                <Stethoscope className="h-4 w-4" />
                Paciente de {veterinaria.nombre}
              </p>
            )}

            <div className="mt-6 rounded-2xl bg-brand-faint p-5">
              <h2 className="text-lg font-extrabold text-stone-900">¿La encontraste?</h2>
              {whatsappHref ? (
                <>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex items-center justify-center gap-2 rounded-full bg-status-encontrado px-6 py-3.5 text-lg font-extrabold text-white transition hover:brightness-110"
                  >
                    <MessageCircle className="h-6 w-6" />
                    Avisar a la veterinaria por WhatsApp
                  </a>
                  <a
                    href={`tel:${veterinaria.whatsapp}`}
                    className="mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-stone-300 px-6 py-2.5 font-extrabold text-stone-700 transition hover:border-stone-400"
                  >
                    <Phone className="h-5 w-5" />
                    Llamar
                  </a>
                </>
              ) : (
                <p className="mt-3 rounded-xl bg-stone-100 px-4 py-3 text-sm font-bold text-stone-600">
                  Esta veterinaria aún no cargó su WhatsApp.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ------------------------- VISTA CLÍNICA ------------------------- */
  const duenoWa = pet.dueno_whatsapp
    ? waLink(pet.dueno_whatsapp, `Hola ${pet.dueno_nombre || ''}, te escribo de ${veterinaria?.nombre || 'la veterinaria'} por ${pet.nombre}.`)
    : null

  return (
    <div className="mx-auto max-w-2xl animate-fade-up px-4 py-8">
      <Link to="/panel" className="text-sm font-bold text-brand hover:underline">
        ← Volver a mis pacientes
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-card">
        <div className="flex flex-col gap-5 p-6 sm:flex-row">
          <PetPhoto
            src={pet.foto_url}
            alt={pet.nombre}
            className="h-44 w-44 shrink-0 rounded-2xl object-cover"
          />
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-white">
              <Stethoscope className="h-3.5 w-3.5" /> Ficha clínica
            </span>
            <h1 className="mt-2 text-3xl font-extrabold text-stone-900">{pet.nombre}</h1>
            <p className="mt-1 text-stone-600">
              {[pet.especie, pet.edad].filter(Boolean).join(' · ')}
            </p>
            {pet.senas && <p className="mt-2 text-sm text-stone-600">{pet.senas}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPetModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
              >
                <Pencil className="h-4 w-4" /> Editar
              </button>
              <button
                type="button"
                onClick={() => setQrModal(true)}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
              >
                <QrCode className="h-4 w-4" /> Ver QR
              </button>
              {confirming === 'pet' ? (
                <span className="inline-flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleDeletePet}
                    className="inline-flex items-center gap-1.5 rounded-full bg-status-perdido px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-110"
                  >
                    <Trash2 className="h-4 w-4" /> Sí, eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirming(null)}
                    className="rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-500"
                  >
                    No
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirming('pet')}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-400 transition hover:border-status-perdido hover:text-status-perdido"
                >
                  <Trash2 className="h-4 w-4" /> Eliminar
                </button>
              )}
            </div>
          </div>
        </div>

        {(pet.dueno_nombre || duenoWa) && (
          <div className="border-t border-stone-100 px-6 py-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wide text-stone-500">
              Dueño
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {pet.dueno_nombre && (
                <p className="font-extrabold text-stone-900">{pet.dueno_nombre}</p>
              )}
              {duenoWa && (
                <a
                  href={duenoWa}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-95"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-stone-900">Historial de atenciones</h2>
        <button
          type="button"
          onClick={() => setAtencionModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
        >
          <Plus className="h-4 w-4" /> Nueva atención
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {atenciones.length === 0 && (
          <EmptyState
            title="Sin atenciones todavía"
            text="Cargá la primera vacuna, visita o tratamiento de este paciente."
          />
        )}
        {atenciones.map((a) => {
          const meta = tipoMeta(a.tipo)
          return (
            <div key={a.id} className="rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${meta.cls}`}
                  >
                    {meta.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-stone-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {formatFecha(a.fecha)}
                  </span>
                </div>
                {confirming === a.id ? (
                  <span className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDeleteAtencion(a.id)}
                      className="rounded-full bg-status-perdido px-3 py-1 text-xs font-extrabold text-white transition hover:brightness-110"
                    >
                      Sí, eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="rounded-full border border-stone-200 px-3 py-1 text-xs font-extrabold text-stone-500"
                    >
                      No
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(a.id)}
                    className="p-1.5 text-stone-300 transition hover:text-status-perdido"
                    aria-label="Eliminar atención"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <h3 className="mt-2 font-extrabold text-stone-900">{a.titulo}</h3>
              {a.detalle && (
                <p className="mt-1 whitespace-pre-line text-sm text-stone-600">{a.detalle}</p>
              )}
              {a.proxima_fecha && (
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Próxima: {formatFecha(a.proxima_fecha)}
                </p>
              )}
              {a.notas && (
                <p className="mt-2 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-500">
                  {a.notas}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <AtencionModal
        open={atencionModal}
        onClose={() => setAtencionModal(false)}
        onSaved={refresh}
        mascotaId={pet.id}
        veterinariaId={pet.veterinaria_id}
      />
      <PetFormModal
        open={petModal}
        onClose={() => setPetModal(false)}
        onSaved={refresh}
        pet={pet}
        veterinariaId={pet.veterinaria_id}
      />
      <QrPlateModal
        open={qrModal}
        onClose={() => setQrModal(false)}
        pet={pet}
        ownerPhone={veterinaria?.whatsapp}
        contactLabel="Avisá a mi veterinaria por WhatsApp"
      />
    </div>
  )
}
