import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Camera,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Heart,
  Loader2,
  PawPrint,
  QrCode,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react'
import Logo from '../components/Logo'
import { useAuth } from '../hooks/useAuth'
import { createOwnerPet, getMyVeterinaria, uploadPetPhoto } from '../lib/store'
import { qrDataURL } from '../lib/qr'

const inputCls =
  'w-full rounded-xl border border-stone-300 px-4 py-2.5 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand-soft'
const labelCls = 'mb-1 block text-sm font-bold text-stone-700'

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro']

function Spinner() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-10 w-10 animate-spin text-brand" />
    </div>
  )
}

/* --------------------- Vista cuando no hay sesión --------------------- */

function NeedAccount() {
  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-stone-900">
          Registrá a tu mascota gratis
        </h1>
        <p className="mt-3 text-center text-sm text-stone-600">
          Creás su ficha en Patitas y descargás su QR para el collar. Si algún día se
          pierde, quien lo escanee va a poder avisarte por WhatsApp al instante.
        </p>
        <ul className="mt-5 space-y-3 text-sm text-stone-600">
          <li className="flex items-start gap-2.5">
            <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Es gratis y no necesitás que tu veterinaria esté adherida. El registro
            gratuito cubre hasta 3 mascotas por cuenta.
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Tu WhatsApp se muestra en la ficha solo con tu permiso, y podés cambiarlo
            o quitarlo cuando quieras.
          </li>
          <li className="flex items-start gap-2.5">
            <PawPrint className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
            Necesitás una cuenta (email y contraseña) para poder editar la ficha
            después.
          </li>
        </ul>
        <Link
          to="/ingresar"
          state={{ from: '/registrar-mascota' }}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark"
        >
          Crear cuenta o ingresar
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

/* --------------------------- Éxito + QR ------------------------------- */

const DONATE_MP_ALIAS = 'facundo.9dejulio'

function Success({ pet, onAnother }) {
  const [qrImg, setQrImg] = useState(null)
  const [aliasCopied, setAliasCopied] = useState(false)
  const fichaUrl = `${window.location.origin}/m/${pet.id}`

  async function handleCopyAlias() {
    try {
      await navigator.clipboard.writeText(DONATE_MP_ALIAS)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = DONATE_MP_ALIAS
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setAliasCopied(true)
    setTimeout(() => setAliasCopied(false), 2000)
  }

  useEffect(() => {
    qrDataURL(fichaUrl, 640)
      .then(setQrImg)
      .catch(() => setQrImg(null))
  }, [fichaUrl])

  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <CheckCircle2 className="mx-auto h-14 w-14 text-status-encontrado" />
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
          ¡{pet.nombre} ya tiene su ficha!
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Descargá el QR, imprimilo y colgalo de su collar. Quien lo escanee va a ver
          la ficha de {pet.nombre} y va a poder avisarte por WhatsApp.
        </p>

        {qrImg && (
          <img
            src={qrImg}
            alt={`QR de ${pet.nombre}`}
            className="mx-auto mt-6 h-56 w-56 rounded-2xl border-2 border-stone-100"
          />
        )}

        <div className="mt-6 flex flex-col gap-2">
          {qrImg && (
            <a
              href={qrImg}
              download={`qr-${pet.nombre}.png`}
              className="flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-extrabold text-white transition hover:bg-accent-dark"
            >
              <Download className="h-5 w-5" /> Descargar QR (PNG)
            </a>
          )}
          <Link
            to={`/m/${pet.id}`}
            className="rounded-full border-2 border-stone-200 px-6 py-2.5 font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
          >
            Ver la ficha pública
          </Link>
          <Link
            to="/mis-mascotas"
            className="rounded-full border-2 border-stone-200 px-6 py-2.5 font-extrabold text-stone-700 transition hover:border-brand hover:text-brand"
          >
            Ir a Mis mascotas
          </Link>
          <button
            type="button"
            onClick={onAnother}
            className="mt-1 text-sm font-bold text-brand hover:underline"
          >
            Registrar otra mascota
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-brand-faint px-5 py-4">
          <p className="flex items-center justify-center gap-1.5 text-sm font-extrabold text-stone-800">
            <Heart className="h-4 w-4 text-brand" fill="currentColor" />
            Patitas es gratis
          </p>
          <p className="mt-1 text-sm text-stone-600">
            Si te sirvió, podés colaborar con lo que quieras por Mercado Pago.
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-stone-500">
              Alias
            </span>
            <code className="select-all rounded-lg border border-stone-200 bg-white px-3 py-1.5 font-mono text-sm font-bold text-stone-800">
              {DONATE_MP_ALIAS}
            </code>
            <button
              type="button"
              onClick={handleCopyAlias}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-extrabold transition ${
                aliasCopied
                  ? 'bg-brand text-white'
                  : 'border border-stone-200 bg-white text-stone-700 hover:border-brand hover:text-brand'
              }`}
            >
              {aliasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {aliasCopied ? '¡Copiado!' : 'Copiar alias'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------ Formulario ---------------------------- */

function RegisterForm() {
  const { user } = useAuth()
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [raza, setRaza] = useState('')
  const [senas, setSenas] = useState('')
  const [duenoNombre, setDuenoNombre] = useState('')
  const [duenoWhatsapp, setDuenoWhatsapp] = useState('')
  const [consentimiento, setConsentimiento] = useState(false)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)
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
    if (!nombre.trim() || !duenoNombre.trim() || !duenoWhatsapp.trim()) {
      setError('Completá el nombre de tu mascota, tu nombre y tu WhatsApp.')
      return
    }
    if (!consentimiento) {
      setError(
        'Para crear la ficha necesitamos tu OK: es lo que permite que quien encuentre a tu mascota te avise.',
      )
      return
    }
    setSubmitting(true)
    try {
      const foto_url = file ? await uploadPetPhoto(file) : null
      const pet = await createOwnerPet(user.id, {
        nombre: nombre.trim(),
        especie,
        raza: raza.trim(),
        senas: senas.trim(),
        foto_url,
        dueno_nombre: duenoNombre.trim(),
        dueno_whatsapp: duenoWhatsapp.trim(),
        consentimiento: true,
      })
      setCreated(pet)
    } catch (err) {
      if (err?.code === 'LIMITE_MASCOTAS') {
        setError(err.message)
      } else {
        setError(
          err?.message
            ? `No se pudo registrar: ${err.message}`
            : 'No se pudo registrar. Probá de nuevo.',
        )
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (created) {
    return (
      <Success
        pet={created}
        onAnother={() => {
          setCreated(null)
          setNombre('')
          setRaza('')
          setSenas('')
          setFile(null)
          setPreview(null)
          setConsentimiento(false)
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-card">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-center text-2xl font-extrabold text-stone-900">
          Registrá a tu mascota
        </h1>
        <p className="mt-2 text-center text-sm text-stone-500">
          Completá los datos y generás su QR gratis, listo para el collar.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <fieldset className="space-y-4">
            <legend className="text-sm font-extrabold uppercase tracking-wide text-stone-400">
              Tu mascota
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre *</label>
                <input
                  className={inputCls}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Blanca"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Especie *</label>
                <select
                  className={inputCls}
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                >
                  {ESPECIES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Raza</label>
              <input
                className={inputCls}
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                placeholder="Ej: Mestiza, Caniche, Siamés…"
              />
            </div>
            <div>
              <label className={labelCls}>Señas particulares</label>
              <textarea
                className={inputCls + ' min-h-[60px] resize-y'}
                value={senas}
                onChange={(e) => setSenas(e.target.value)}
                placeholder="Color, manchas, collar, tamaño… lo que ayude a reconocerla"
              />
            </div>
            <div>
              <label className={labelCls}>Foto</label>
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
                {preview ? 'Cambiar foto' : 'Subir foto'}
              </button>
              {preview && (
                <img
                  src={preview}
                  alt="Vista previa de la mascota"
                  className="mx-auto mt-3 h-24 w-24 rounded-2xl object-cover shadow-card"
                />
              )}
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-extrabold uppercase tracking-wide text-stone-400">
              Tus datos de contacto
            </legend>
            <div>
              <label className={labelCls}>Tu nombre *</label>
              <input
                className={inputCls}
                value={duenoNombre}
                onChange={(e) => setDuenoNombre(e.target.value)}
                placeholder="Ej: María González"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Tu WhatsApp *</label>
              <input
                className={inputCls}
                value={duenoWhatsapp}
                onChange={(e) => setDuenoWhatsapp(e.target.value)}
                placeholder="Ej: 5492262000000"
                required
              />
              <p className="mt-1.5 text-xs text-stone-500">
                Con código de país y área, sin espacios ni guiones. Es el número al que
                te van a avisar si encuentran a tu mascota.
              </p>
            </div>
          </fieldset>

          <label className="flex items-start gap-3 rounded-xl bg-brand-faint px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#0F766E]"
            />
            <span className="text-sm text-stone-700">
              <strong>Acepto que mi nombre y mi WhatsApp se muestren en la ficha
              pública de mi mascota</strong>, para que la persona que la encuentre
              pueda contactarme. Sin este permiso no podemos crear la ficha: es el
              dato que hace que el QR sirva para recuperarla. Podés cambiarlo o
              quitarlo cuando quieras desde «Mis mascotas».
            </span>
          </label>

          {error && <p className="text-sm font-bold text-status-perdido">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {submitting ? 'Registrando…' : 'Crear ficha y generar QR'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ------------- Vista cuando la cuenta ya es de veterinaria ------------ */

function VetAccountNotice() {
  return (
    <div className="mx-auto max-w-md animate-fade-up px-4 py-12">
      <div className="rounded-3xl bg-white p-8 text-center shadow-card">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Stethoscope className="h-7 w-7" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
          Esta cuenta ya es de una veterinaria
        </h1>
        <p className="mt-3 text-sm text-stone-600">
          Con este correo ya tenés tu veterinaria registrada en Patitas. Cada cuenta
          tiene un solo rol: <strong>veterinaria o dueño</strong>. Si además querés
          registrar a tu propia mascota como dueño, hacelo con otro correo.
        </p>
        <Link
          to="/panel"
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark"
        >
          Ir a mi panel
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

/* -------------------------------- Página ------------------------------ */

export default function OwnerRegister() {
  const { user, loading } = useAuth()
  const [vet, setVet] = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    async function check() {
      if (!user) {
        if (mounted) {
          setVet(null)
          setChecking(false)
        }
        return
      }
      try {
        const v = await getMyVeterinaria(user.id)
        if (mounted) setVet(v)
      } catch {
        if (mounted) setVet(null)
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
  if (!user) return <NeedAccount />
  if (vet) return <VetAccountNotice />
  return <RegisterForm />
}
