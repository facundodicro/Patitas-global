import { useEffect, useRef, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import { updatePet, uploadPetPhoto } from '../lib/store'

const inputCls =
  'w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition'
const labelCls = 'block text-sm font-bold text-stone-700 mb-1.5'

const ESPECIES = ['Perro', 'Gato', 'Ave', 'Conejo', 'Otro']

/**
 * Edición de una mascota registrada por su dueño (origen 'dueno').
 * Permite corregir datos de la mascota, del contacto, cambiar la foto
 * y revocar/reactivar el consentimiento de contacto público.
 */
export default function OwnerPetFormModal({ open, onClose, onSaved, pet }) {
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [raza, setRaza] = useState('')
  const [senas, setSenas] = useState('')
  const [duenoNombre, setDuenoNombre] = useState('')
  const [duenoWhatsapp, setDuenoWhatsapp] = useState('')
  const [consentimiento, setConsentimiento] = useState(true)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    if (open && pet) {
      setNombre(pet.nombre || '')
      setEspecie(pet.especie || 'Perro')
      setRaza(pet.raza || '')
      setSenas(pet.senas || '')
      setDuenoNombre(pet.dueno_nombre || '')
      setDuenoWhatsapp(pet.dueno_whatsapp || '')
      setConsentimiento(pet.consentimiento_contacto !== false)
      setFile(null)
      setPreview(pet.foto_url || null)
      setError('')
    }
  }, [open, pet])

  if (!open || !pet) return null

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
      setError('Completá el nombre de la mascota, tu nombre y tu WhatsApp.')
      return
    }
    setSubmitting(true)
    try {
      const foto_url = file ? await uploadPetPhoto(file) : pet.foto_url
      await updatePet(pet.id, {
        nombre: nombre.trim(),
        especie,
        raza: raza.trim() || null,
        senas: senas.trim() || null,
        foto_url,
        dueno_nombre: duenoNombre.trim(),
        dueno_whatsapp: duenoWhatsapp.trim(),
        consentimiento_contacto: consentimiento,
      })
      onSaved?.()
      onClose()
    } catch (err) {
      setError(err?.message || 'No se pudo guardar. Probá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

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
          <h2 className="text-xl font-extrabold text-stone-900">Editar a {pet.nombre}</h2>
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
                alt="Vista previa"
                className="mx-auto mt-3 h-24 w-24 rounded-2xl object-cover shadow-card"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Nombre *</label>
              <input
                className={inputCls}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
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
              placeholder="Color, manchas, collar, tamaño…"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Tu nombre *</label>
              <input
                className={inputCls}
                value={duenoNombre}
                onChange={(e) => setDuenoNombre(e.target.value)}
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
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-brand-faint px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#0F766E]"
            />
            <span className="text-sm text-stone-700">
              <strong>Mostrar mi WhatsApp en la ficha pública</strong>, para que quien
              encuentre a mi mascota pueda avisarme. Si lo desmarcás, la ficha se sigue
              viendo pero sin botón de contacto.
            </span>
          </label>

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
            {submitting ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
