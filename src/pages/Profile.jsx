import { useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, QrCode, Trash2, TriangleAlert, X } from 'lucide-react'
import PetPhoto from '../components/PetPhoto'
import EmptyState from '../components/EmptyState'
import PetFormModal from '../components/PetFormModal'
import QrPlateModal from '../components/QrPlateModal'
import { useAuth } from '../hooks/useAuth'
import {
  DEMO_MODE,
  deletePet,
  getProfile,
  listMyPets,
  upsertProfile,
} from '../lib/store'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [petModal, setPetModal] = useState({ open: false, pet: null })
  const [qrModal, setQrModal] = useState({ open: false, pet: null })
  const [demoBanner, setDemoBanner] = useState(true)

  // Formulario de datos
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [zona, setZona] = useState('')

  async function refresh() {
    const [prof, myPets] = await Promise.all([
      getProfile(user.id),
      listMyPets(user.id),
    ])
    setProfile(prof)
    setPets(myPets)
    if (prof) {
      setNombre(prof.nombre || '')
      setTelefono(prof.telefono || '')
      setZona(prof.zona || '')
    }
  }

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        await refresh()
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user) load()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    setSavedMsg('')
    try {
      await upsertProfile(user.id, { nombre, telefono, zona })
      setProfile((prev) => ({ ...prev, nombre, telefono, zona }))
      setSavedMsg('Datos guardados')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(pet) {
    if (!window.confirm(`¿Eliminar a ${pet.nombre}?`)) return
    await deletePet(pet.id)
    setPets((prev) => prev.filter((p) => p.id !== pet.id))
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-brand" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8">
      <h1 className="text-3xl font-extrabold text-stone-900">Mi perfil</h1>

      {DEMO_MODE && demoBanner && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="flex-1 text-sm font-bold text-amber-800">
            Estás en modo demo: tus datos se guardan en este navegador. Conectá Supabase para
            guardarlos en la nube (ver SUPABASE.md).
          </p>
          <button
            type="button"
            onClick={() => setDemoBanner(false)}
            aria-label="Cerrar aviso"
            className="text-amber-600 transition hover:text-amber-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* MIS DATOS */}
      <section className="mt-6 rounded-3xl bg-white p-6 shadow-card">
        <h2 className="text-xl font-extrabold text-stone-900">Mis datos</h2>
        <form onSubmit={handleSaveProfile} className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="nombre" className="mb-1 block text-sm font-bold text-stone-700">
              Nombre *
            </label>
            <input
              id="nombre"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
          <div>
            <label htmlFor="telefono" className="mb-1 block text-sm font-bold text-stone-700">
              Teléfono / WhatsApp *
            </label>
            <input
              id="telefono"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 5492262000000"
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-bold text-stone-700">
              Email
            </label>
            <input
              id="email"
              value={user.email || ''}
              readOnly
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-stone-500"
            />
          </div>
          <div>
            <label htmlFor="zona" className="mb-1 block text-sm font-bold text-stone-700">
              Zona
            </label>
            <input
              id="zona"
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              placeholder="Ej: Palermo, Buenos Aires"
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-brand px-6 py-2.5 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              {saving && <Loader2 className="h-5 w-5 animate-spin" />}
              Guardar datos
            </button>
            {savedMsg && <span className="text-sm font-bold text-brand">{savedMsg}</span>}
          </div>
        </form>
      </section>

      {/* MIS MASCOTAS */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-stone-900">Mis mascotas</h2>
          <button
            type="button"
            onClick={() => setPetModal({ open: true, pet: null })}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 font-extrabold text-white transition hover:bg-accent-dark"
          >
            <Plus className="h-5 w-5" />
            Registrar mascota
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Todavía no registraste mascotas"
              text="Creá el perfil de tu primera mascota y descargá su placa QR."
              actionLabel="Registrar mascota"
              onAction={() => setPetModal({ open: true, pet: null })}
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div key={pet.id} className="overflow-hidden rounded-2xl bg-white shadow-card">
                <PetPhoto src={pet.foto_url} alt={pet.nombre} className="h-40 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-extrabold text-stone-900">{pet.nombre}</p>
                  {pet.especie && <p className="text-sm text-stone-500">{pet.especie}</p>}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setQrModal({ open: true, pet })}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
                    >
                      <QrCode className="h-4 w-4" />
                      Placa QR
                    </button>
                    <button
                      type="button"
                      onClick={() => setPetModal({ open: true, pet })}
                      className="inline-flex items-center gap-1.5 rounded-full border border-stone-300 px-3 py-1.5 text-sm font-extrabold text-stone-700 transition hover:border-stone-400"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pet)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-status-perdido/30 px-3 py-1.5 text-sm font-extrabold text-status-perdido transition hover:bg-status-perdido/5"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <PetFormModal
        key={petModal.pet?.id ?? 'nueva'}
        open={petModal.open}
        onClose={() => setPetModal({ open: false, pet: null })}
        onSaved={async (p) => {
          await refresh()
          setQrModal({ open: true, pet: p })
        }}
        pet={petModal.pet}
        ownerId={user.id}
      />
      <QrPlateModal
        open={qrModal.open}
        onClose={() => setQrModal({ open: false, pet: null })}
        pet={qrModal.pet}
        ownerPhone={profile?.telefono}
      />
    </div>
  )
}
