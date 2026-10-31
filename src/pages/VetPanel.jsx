import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Camera,
  Check,
  Loader2,
  LogOut,
  PawPrint,
  Pencil,
  Plus,
  QrCode,
  Search,
  Stethoscope,
  X,
} from 'lucide-react'
import Logo from '../components/Logo'
import PetPhoto from '../components/PetPhoto'
import EmptyState from '../components/EmptyState'
import PetFormModal from '../components/PetFormModal'
import QrPlateModal from '../components/QrPlateModal'
import AtencionFormModal from '../components/AtencionFormModal'
import { useAuth } from '../hooks/useAuth'
import {
  createVeterinaria,
  DEMO_MODE,
  getMyVeterinaria,
  listAtenciones,
  listMyPets,
  listVetPets,
  updateVeterinaria,
  uploadPetPhoto,
} from '../lib/store'

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft'
const labelCls = 'mb-1 block text-sm font-bold text-stone-700'

/* ------------------------- Login de veterinarias ------------------------ */

function VetLogin() {
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
          Acceso veterinarias
        </h1>
        <p className="mt-2 text-center text-sm text-stone-500">
          Ingresá con la cuenta de tu veterinaria.
        </p>
        {DEMO_MODE && (
          <p className="mt-3 rounded-xl bg-brand-faint px-4 py-2.5 text-xs font-bold text-brand-dark">
            Modo demo: ingresá con vete@demo.com (cualquier contraseña de 6+ caracteres)
            para ver la veterinaria de ejemplo.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="vet-email" className={labelCls}>
              Email
            </label>
            <input
              id="vet-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="veterinaria@email.com"
            />
          </div>
          <div>
            <label htmlFor="vet-password" className={labelCls}>
              Contraseña
            </label>
            <input
              id="vet-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
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
        <p className="mt-6 text-center text-sm text-stone-500">
          ¿No tenés cuenta?{' '}
          <Link to="/ingresar" className="font-extrabold text-brand hover:underline">
            Creá una acá
          </Link>
        </p>
      </div>
    </div>
  )
}

/* ----------------------- Registro de veterinaria ------------------------ */

function VetRegister({ onSaved }) {
  const { user } = useAuth()
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [direccion, setDireccion] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function handleFile(f) {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!nombre.trim() || !whatsapp.trim()) {
      setError('Completá el nombre y el WhatsApp de la veterinaria.')
      return
    }
    setSubmitting(true)
    try {
      const logo_url = file ? await uploadPetPhoto(file) : null
      const vet = await createVeterinaria(user.id, {
        nombre: nombre.trim(),
        whatsapp: whatsapp.trim(),
        direccion: direccion.trim(),
        logo_url,
      })
      onSaved(vet)
    } catch (err) {
      setError(err?.message || 'No se pudo guardar. Probá de nuevo.')
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
          Registrá tu veterinaria
        </h1>
        <p className="mt-2 text-center text-sm text-stone-500">
          Estos datos aparecen en el QR de tus pacientes.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              className={inputCls}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Veterinaria Huellas"
              required
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp *</label>
            <input
              className={inputCls}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej: 5492262000000"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Dirección</label>
            <input
              className={inputCls}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. 58 1234, Necochea"
            />
          </div>
          <div>
            <label className={labelCls}>Logo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 px-4 py-3 text-sm font-bold text-stone-500 transition hover:border-brand hover:text-brand"
            >
              <Camera className="h-4 w-4" />
              {preview ? 'Cambiar logo' : 'Subir logo'}
            </button>
            {preview && (
              <img
                src={preview}
                alt="Vista previa del logo"
                className="mx-auto mt-3 h-24 w-24 rounded-2xl object-cover shadow-card"
              />
            )}
          </div>
          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {submitting ? 'Guardando…' : 'Registrar veterinaria'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* --------------------- Editar perfil del negocio ----------------------- */

function VetProfileModal({ onClose, onSaved, veterinaria }) {
  const [nombre, setNombre] = useState(veterinaria.nombre || '')
  const [whatsapp, setWhatsapp] = useState(veterinaria.whatsapp || '')
  const [direccion, setDireccion] = useState(veterinaria.direccion || '')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(veterinaria.logo_url || null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  function handleFile(f) {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!nombre.trim() || !whatsapp.trim()) {
      setError('Completá el nombre y el WhatsApp de la veterinaria.')
      return
    }
    setSubmitting(true)
    try {
      const logo_url = file ? await uploadPetPhoto(file) : veterinaria.logo_url
      const row = await updateVeterinaria(veterinaria.id, {
        nombre: nombre.trim(),
        whatsapp: whatsapp.trim(),
        direccion: direccion.trim(),
        logo_url,
      })
      onSaved(row)
      onClose()
    } catch (err) {
      setError(err?.message || 'No se pudo guardar. Probá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-pop animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-stone-900">Editar perfil</h2>
          <button
            type="button"
            onClick={onClose}
            className="-m-2 p-2 text-stone-400 transition hover:text-stone-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="-mt-2 mb-5 text-sm text-stone-500">
          Estos datos aparecen en el QR de tus pacientes.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Nombre *</label>
            <input
              className={inputCls}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Veterinaria Huellas"
              required
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp *</label>
            <input
              className={inputCls}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ej: 5492262000000"
              required
            />
          </div>
          <div>
            <label className={labelCls}>Dirección</label>
            <input
              className={inputCls}
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. 58 1234, Necochea"
            />
          </div>
          <div>
            <label className={labelCls}>Logo</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 px-4 py-3 text-sm font-bold text-stone-500 transition hover:border-brand hover:text-brand"
            >
              <Camera className="h-4 w-4" />
              {preview ? 'Cambiar logo' : 'Subir logo'}
            </button>
            {preview && (
              <img
                src={preview}
                alt="Vista previa del logo"
                className="mx-auto mt-3 h-24 w-24 rounded-2xl object-cover shadow-card"
              />
            )}
          </div>
          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ------------------------------ Dashboard ------------------------------- */

function Dashboard({ veterinaria, onProfileUpdated }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [ultimas, setUltimas] = useState({})
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [petModal, setPetModal] = useState({ open: false, pet: null })
  const [qrModal, setQrModal] = useState({ open: false, pet: null })
  const [successPet, setSuccessPet] = useState(null)
  const [atencionPet, setAtencionPet] = useState(null)
  const [profileOpen, setProfileOpen] = useState(false)

  async function refresh() {
    const list = await listVetPets(veterinaria.id)
    setPets(list)
    const map = {}
    await Promise.all(
      list.map(async (p) => {
        const at = await listAtenciones(p.id).catch(() => [])
        if (at.length > 0) map[p.id] = at[0]
      }),
    )
    setUltimas(map)
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
  }, [veterinaria.id])

  const q = query.trim().toLowerCase()
  const filtered = q
    ? pets.filter((p) =>
        [p.nombre, p.especie, p.dueno_nombre].filter(Boolean).join(' ').toLowerCase().includes(q),
      )
    : pets

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  if (loading) return <Spinner />

  return (
    <div className="mx-auto max-w-6xl animate-fade-up px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {veterinaria.logo_url ? (
            <img
              src={veterinaria.logo_url}
              alt={veterinaria.nombre}
              className="h-14 w-14 rounded-2xl object-cover shadow-card"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <span className="text-xl font-extrabold">
                {veterinaria.nombre.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">{veterinaria.nombre}</h1>
            <p className="text-sm text-stone-500">
              {pets.length} paciente{pets.length === 1 ? '' : 's'} registrado
              {pets.length === 1 ? '' : 's'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPetModal({ open: true, pet: null })}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand px-5 py-2.5 text-sm font-extrabold text-white transition hover:bg-brand-dark"
          >
            <Plus className="h-4 w-4" /> Registrar mascota
          </button>
          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-600 transition hover:border-stone-300"
          >
            <Pencil className="h-4 w-4" /> Editar perfil
          </button>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 rounded-full border-2 border-stone-200 px-4 py-2 text-sm font-extrabold text-stone-600 transition hover:border-stone-300"
          >
            <LogOut className="h-4 w-4" /> Salir
          </button>
        </div>
      </div>

      <div className="relative mt-6 max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por mascota, especie o dueño…"
          className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title={q ? 'Sin resultados' : 'Todavía no hay pacientes'}
            text={
              q
                ? 'Probá con otro nombre.'
                : 'Registrá tu primera mascota y generá su QR.'
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => {
            const ultima = ultimas[p.id]
            return (
              <div
                key={p.id}
                className="cursor-pointer rounded-3xl bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-pop"
                onClick={() => navigate(`/m/${p.id}`)}
              >
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
                      {[p.especie, p.edad].filter(Boolean).join(' · ')}
                    </p>
                    {p.dueno_nombre && (
                      <p className="truncate text-sm font-bold text-stone-600">
                        {p.dueno_nombre}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    title="Ver QR"
                    aria-label={`Ver QR de ${p.nombre}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setQrModal({ open: true, pet: p })
                    }}
                    className="rounded-full p-2 text-stone-400 transition hover:bg-brand-soft hover:text-brand"
                  >
                    <QrCode className="h-5 w-5" />
                  </button>
                </div>
                <div className="mt-3 border-t border-stone-100 pt-3">
                  {ultima ? (
                    <p className="flex items-center gap-1.5 text-xs font-bold text-stone-500">
                      <CalendarDays className="h-3.5 w-3.5" />
                      Última atención: {ultima.titulo}
                    </p>
                  ) : (
                    <p className="text-xs font-bold text-stone-400">Sin atenciones todavía</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <PetFormModal
        open={petModal.open}
        onClose={() => setPetModal({ open: false, pet: null })}
        onSaved={(saved) => {
          refresh()
          if (!petModal.pet && saved) setSuccessPet(saved)
        }}
        pet={petModal.pet}
        veterinariaId={veterinaria.id}
      />
      <QrPlateModal
        open={qrModal.open}
        onClose={() => setQrModal({ open: false, pet: null })}
        pet={qrModal.pet}
        ownerPhone={veterinaria.whatsapp}
        contactLabel="Avisá a mi veterinaria por WhatsApp"
      />
      {successPet && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
          onClick={() => setSuccessPet(null)}
        >
          <div
            className="w-full max-w-md animate-fade-up rounded-2xl bg-white p-6 shadow-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <PetPhoto
                src={successPet.foto_url}
                alt={successPet.nombre}
                className="h-20 w-20 rounded-2xl object-cover shadow-card"
              />
              <h2 className="mt-4 text-xl font-extrabold text-stone-900">
                ¡{successPet.nombre} ya es tu paciente!
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Quedó registrado en tu panel. ¿Seguimos con su QR o con su primera atención?
              </p>
            </div>
            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setQrModal({ open: true, pet: successPet })
                  setSuccessPet(null)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-base font-extrabold text-white shadow-card transition hover:bg-brand-dark"
              >
                <QrCode className="h-5 w-5" /> Ver su QR
              </button>
              <button
                type="button"
                onClick={() => {
                  setAtencionPet(successPet)
                  setSuccessPet(null)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-brand py-3 text-base font-extrabold text-brand transition hover:bg-brand-soft"
              >
                <Stethoscope className="h-5 w-5" /> Cargar su primera atención
              </button>
              <button
                type="button"
                onClick={() => setSuccessPet(null)}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-extrabold text-stone-500 transition hover:text-stone-800"
              >
                <Check className="h-4 w-4" /> Listo, por ahora no
              </button>
            </div>
          </div>
        </div>
      )}
      {profileOpen && (
        <VetProfileModal
          onClose={() => setProfileOpen(false)}
          onSaved={(row) => onProfileUpdated?.(row)}
          veterinaria={veterinaria}
        />
      )}
      <AtencionFormModal
        open={!!atencionPet}
        onClose={() => setAtencionPet(null)}
        onSaved={() => {
          setAtencionPet(null)
          refresh()
        }}
        mascotaId={atencionPet?.id}
        veterinariaId={veterinaria.id}
      />
    </div>
  )
}

/* ------------- Vista cuando la cuenta ya es de dueño ------------------ */

function OwnerAccountNotice() {
  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <PawPrint className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
          Esta cuenta ya es de dueño
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Con este correo ya registraste a tus mascotas como dueño. Cada cuenta
          tiene un solo rol: <strong>dueño o veterinaria</strong>. Si tenés una
          veterinaria y querés sumarla a Patitas, registrala con otro correo.
        </p>
        <Link
          to="/mis-mascotas"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark"
        >
          Ir a mis mascotas
        </Link>
        <Link
          to="/"
          className="mt-4 block text-center text-sm font-bold text-brand hover:underline"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

/* --------------------------------- Panel -------------------------------- */

export default function VetPanel() {
  const { user, loading } = useAuth()
  const [veterinaria, setVeterinaria] = useState(null)
  const [hasPets, setHasPets] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    async function check() {
      if (!user) {
        if (mounted) {
          setVeterinaria(null)
          setHasPets(false)
          setChecking(false)
        }
        return
      }
      try {
        const [vet, pets] = await Promise.all([
          getMyVeterinaria(user.id),
          listMyPets(user.id).catch(() => []),
        ])
        if (mounted) {
          setVeterinaria(vet)
          setHasPets(pets.length > 0)
        }
      } catch {
        if (mounted) setVeterinaria(null)
      } finally {
        if (mounted) setChecking(false)
      }
    }
    if (!loading) check()
    return () => {
      mounted = false
    }
  }, [user, loading])

  if (loading || checking) return <Spinner />
  if (!user) return <VetLogin />
  if (!veterinaria && hasPets) return <OwnerAccountNotice />
  if (!veterinaria) return <VetRegister onSaved={setVeterinaria} />
  return <Dashboard veterinaria={veterinaria} onProfileUpdated={setVeterinaria} />
}
