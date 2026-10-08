import { useRef, useState } from 'react'
import { X, Camera, Loader2 } from 'lucide-react'
import { createPet, updatePet, uploadPetPhoto } from '../lib/store'
import { QR_DESTINOS } from '../lib/qr'

export default function PetFormModal({ open, onClose, onSaved, pet, ownerId }) {
  const isEdit = !!pet
  const [nombre, setNombre] = useState(pet?.nombre || '')
  const [especie, setEspecie] = useState(pet?.especie || 'Perro')
  const [edad, setEdad] = useState(pet?.edad || '')
  const [senas, setSenas] = useState(pet?.senas || '')
  const [qrDestino, setQrDestino] = useState(pet?.qr_destino || 'ficha')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(pet?.foto_url || null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  if (!open) return null

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) {
      setError('Poné el nombre de tu mascota.')
      return
    }
    setSubmitting(true)
    try {
      let foto_url = pet?.foto_url || null
      if (file) foto_url = await uploadPetPhoto(file)
      const data = {
        nombre: nombre.trim(),
        especie,
        edad: edad.trim(),
        senas: senas.trim(),
        foto_url,
        qr_destino: qrDestino,
      }
      const saved = isEdit ? await updatePet(pet.id, data) : await createPet(ownerId, data)
      onSaved?.(saved)
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
          <h2 className="text-xl font-extrabold text-stone-900">
            {isEdit ? 'Editar mascota' : 'Registrar mascota'}
          </h2>
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
            <label className={labelCls}>Nombre *</label>
            <input
              className={inputCls}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Firulais"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Especie *</label>
              <select className={inputCls} value={especie} onChange={(e) => setEspecie(e.target.value)}>
                <option>Perro</option>
                <option>Gato</option>
                <option>Otro</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Edad</label>
              <input
                className={inputCls}
                value={edad}
                onChange={(e) => setEdad(e.target.value)}
                placeholder="Ej: 2 años"
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Señas particulares</label>
            <textarea
              className={inputCls + ' min-h-[80px] resize-y'}
              value={senas}
              onChange={(e) => setSenas(e.target.value)}
              placeholder="Color, tamaño, collar, marcas distintivas…"
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
              className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-200 px-4 py-3 text-sm font-bold text-stone-500 hover:border-brand hover:text-brand transition"
            >
              <Camera className="h-4 w-4" />
              {preview ? 'Cambiar foto' : 'Subir foto'}
            </button>
            {preview && (
              <img
                src={preview}
                alt="Vista previa"
                className="mt-3 h-40 w-full rounded-xl object-cover shadow-card"
              />
            )}
          </div>

          <div>
            <label className={labelCls}>Destino del QR</label>
            <select
              className={inputCls}
              value={qrDestino}
              onChange={(e) => setQrDestino(e.target.value)}
            >
              {QR_DESTINOS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <p className="mt-1.5 text-xs text-stone-500">
              {QR_DESTINOS.find((d) => d.value === qrDestino)?.hint}
            </p>
          </div>

          {error && (
            <p className="text-sm font-bold text-status-perdido bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-brand hover:bg-brand-light text-white font-extrabold py-3 text-base shadow-card transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
            {submitting ? 'Guardando…' : 'Guardar y generar QR'}
          </button>
        </form>
      </div>
    </div>
  )
}
