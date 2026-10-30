import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Loader2, Pencil, Plus, QrCode, Trash2 } from 'lucide-react'
import PetPhoto from '../components/PetPhoto'
import EmptyState from '../components/EmptyState'
import OwnerPetFormModal from '../components/OwnerPetFormModal'
import QrPlateModal from '../components/QrPlateModal'
import { useAuth } from '../hooks/useAuth'
import { deletePet, listMyPets } from '../lib/store'

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
    </div>
  )
}

/**
 * Panel simple del dueño: sus mascotas registradas por él mismo
 * (origen 'dueno'). Listar, editar datos, eliminar y volver a
 * descargar el QR.
 * No incluye historial clínico: eso es parte del servicio de la
 * veterinaria (Fase 2).
 */
export default function MyPets() {
  const { user, loading: authLoading } = useAuth()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editPet, setEditPet] = useState(null)
  const [qrPet, setQrPet] = useState(null)
  const [confirmPet, setConfirmPet] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    if (!user) return
    try {
      setPets(await listMyPets(user.id))
      setError('')
    } catch (err) {
      setError(err?.message || 'No pudimos cargar tus mascotas.')
    }
  }

  async function handleDelete(pet) {
    setDeleting(true)
    try {
      await deletePet(pet.id)
      setConfirmPet(null)
      await refresh()
    } catch (err) {
      setError(err?.message || 'No pudimos eliminar la mascota.')
    } finally {
      setDeleting(false)
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
  }, [user])

  if (authLoading || loading) return <Spinner />

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <EmptyState
          title="Ingresá para ver tus mascotas"
          text="Necesitás tu cuenta para ver y editar las fichas que registraste."
        />
        <Link
          to="/ingresar"
          state={{ from: '/mis-mascotas' }}
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark"
        >
          Ingresar
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Mis mascotas</h1>
          <p className="text-sm text-stone-500">
            {pets.length} mascota{pets.length === 1 ? '' : 's'} registrada
            {pets.length === 1 ? '' : 's'} por vos
          </p>
        </div>
        {pets.length >= 3 ? (
          <p className="max-w-[240px] text-right text-xs font-semibold leading-snug text-stone-500">
            Llegaste al máximo del registro gratuito: 3 mascotas por cuenta.
          </p>
        ) : (
          <Link
            to="/registrar-mascota"
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Registrar mascota
          </Link>
        )}
      </div>

      {error && (
        <p className="mt-4 text-sm font-bold text-status-perdido bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
          {error}
        </p>
      )}

      {pets.length === 0 && !error ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no registraste mascotas"
            text="Registrá a tu mascota gratis y descargá su QR para el collar."
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {pets.map((p) => (
            <div key={p.id} className="rounded-3xl bg-white p-5 shadow-card">
              <div className="flex items-center gap-4">
                <PetPhoto
                  src={p.foto_url}
                  alt={p.nombre}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-lg font-extrabold text-stone-900">
                    {p.nombre}
                  </h3>
                  <p className="truncate text-sm text-stone-500">
                    {[p.especie, p.raza].filter(Boolean).join(' · ')}
                  </p>
                  <p className="truncate text-sm font-bold text-stone-600">
                    {p.consentimiento_contacto
                      ? 'Contacto público activo'
                      : 'Contacto público desactivado'}
                  </p>
                </div>
              </div>
              {confirmPet?.id === p.id ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-bold text-stone-700">
                    ¿Eliminar la ficha de {p.nombre}? Se borra su ficha pública
                    y su QR deja de funcionar. No se puede deshacer.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleDelete(p)}
                      disabled={deleting}
                      className="inline-flex items-center gap-1.5 rounded-full bg-status-perdido px-4 py-2 text-sm font-extrabold text-white transition hover:brightness-110 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleting ? 'Eliminando…' : 'Sí, eliminar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmPet(null)}
                      disabled={deleting}
                      className="rounded-full border-2 border-stone-200 bg-white px-4 py-2 text-sm font-extrabold text-stone-500 transition hover:border-stone-300 disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to={`/m/${p.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
                  >
                    <Eye className="h-4 w-4" /> Ver ficha
                  </Link>
                  <button
                    type="button"
                    onClick={() => setQrPet(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
                  >
                    <QrCode className="h-4 w-4" /> QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditPet(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
                  >
                    <Pencil className="h-4 w-4" /> Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmPet(p)}
                    className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-400 transition hover:border-status-perdido hover:text-status-perdido"
                  >
                    <Trash2 className="h-4 w-4" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <OwnerPetFormModal
        open={!!editPet}
        onClose={() => setEditPet(null)}
        onSaved={refresh}
        pet={editPet}
      />
      <QrPlateModal
        open={!!qrPet}
        onClose={() => setQrPet(null)}
        pet={qrPet}
        ownerPhone={qrPet?.dueno_whatsapp}
        contactLabel="Avisá a mi dueño por WhatsApp"
      />
    </div>
  )
}
