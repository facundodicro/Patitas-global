import { useEffect, useRef, useState } from 'react'
import { X, AlertTriangle, CheckCircle2, Camera, Loader2, MapPin, Navigation } from 'lucide-react'
import { createReport, updateReport, uploadPetPhoto, DEMO_MODE } from '../lib/store'
import { useAuth } from '../hooks/useAuth'

export default function ReportModal({ open, onClose, onCreated, editing = null, onSaved }) {
  const { user } = useAuth()
  const [tipo, setTipo] = useState('perdida')
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [raza, setRaza] = useState('')
  const [senas, setSenas] = useState('')
  const [recompensa, setRecompensa] = useState('')
  const [zona, setZona] = useState('')
  const [fecha, setFecha] = useState('')
  const [telefono, setTelefono] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [coords, setCoords] = useState(null)
  const [locating, setLocating] = useState(false)
  const [locError, setLocError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  // Al abrir en modo edición, precargar los datos de la publicación
  useEffect(() => {
    if (open && editing) {
      setTipo(editing.tipo === 'encontrada' ? 'encontrada' : 'perdida')
      setNombre(editing.nombre || '')
      setEspecie(editing.especie || 'Perro')
      setRaza(editing.raza || '')
      setSenas(editing.senas || '')
      setRecompensa(editing.recompensa || '')
      setZona(editing.zona || '')
      setFecha(editing.fecha || '')
      setTelefono(editing.telefono || '')
      setFile(null)
      setPreview(editing.foto_url || null)
      setCoords(
        editing.lat != null && editing.lng != null
          ? { lat: editing.lat, lng: editing.lng }
          : null,
      )
      setLocError('')
      setError('')
      setSubmitting(false)
    }
  }, [open, editing])

  if (!open) return null

  const hoy = new Date().toISOString().slice(0, 10)

  const handleFile = (f) => {
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const reset = () => {
    setTipo('perdida')
    setNombre(''); setEspecie('Perro'); setRaza(''); setSenas('')
    setRecompensa(''); setZona(''); setFecha(''); setTelefono('')
    setFile(null); setPreview(null); setError(''); setSubmitting(false)
    setCoords(null); setLocError('')
  }

  const handleUseLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocError('Tu dispositivo no soporta geolocalización.')
      return
    }
    setLocating(true)
    setLocError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      (err) => {
        setLocating(false)
        setLocError(
          err.code === 1
            ? 'Permiso denegado: activá la ubicación en tu navegador para usarla.'
            : 'No se pudo obtener la ubicación. Probá de nuevo.',
        )
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim() || !zona.trim() || !fecha || !telefono.trim()) {
      setError('Completá todos los campos obligatorios.')
      return
    }
    setSubmitting(true)
    try {
      let foto_url = editing?.foto_url ?? null
      if (file) foto_url = await uploadPetPhoto(file)
      const data = {
        tipo,
        nombre: nombre.trim(),
        especie,
        raza: raza.trim(),
        senas: senas.trim(),
        recompensa: tipo === 'perdida' && recompensa.trim() ? recompensa.trim() : null,
        zona: zona.trim(),
        fecha,
        telefono: telefono.trim(),
        foto_url,
        lat: coords?.lat ?? null,
        lng: coords?.lng ?? null,
        // Si ya estaba reunida, se mantiene; si no, sigue al tipo elegido
        estado:
          editing && editing.estado === 'en_casa'
            ? 'en_casa'
            : tipo === 'perdida'
              ? 'perdida'
              : 'encontrada',
      }
      if (editing) {
        const updated = await updateReport(editing.id, data)
        onSaved?.(updated)
      } else {
        const report = await createReport({ reporter_id: user?.id ?? null, ...data })
        onCreated?.(report)
        reset()
      }
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
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-stone-900">
            {editing ? 'Editar publicación' : 'Publicar alerta'}
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

        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setTipo('perdida')}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-extrabold transition ${
              tipo === 'perdida'
                ? 'border-status-perdido bg-red-50 text-status-perdido'
                : 'border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            Perdí a mi mascota
          </button>
          <button
            type="button"
            onClick={() => setTipo('encontrada')}
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-extrabold transition ${
              tipo === 'encontrada'
                ? 'border-status-encontrado bg-green-50 text-status-encontrado'
                : 'border-stone-200 text-stone-500 hover:border-stone-300'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            Encontré una mascota
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
              <label className={labelCls}>Raza</label>
              <input
                className={inputCls}
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                placeholder="Ej: Mestizo"
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

          {tipo === 'perdida' && (
            <div>
              <label className={labelCls}>Recompensa (opcional)</label>
              <input
                className={inputCls}
                value={recompensa}
                onChange={(e) => setRecompensa(e.target.value)}
                placeholder="Ej: $20.000"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Zona *</label>
              <input
                className={inputCls}
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                placeholder="Ej: Palermo, Buenos Aires"
                required
              />
            </div>
            <div>
              <label className={labelCls}>Fecha *</label>
              <input
                type="date"
                className={inputCls}
                value={fecha}
                max={hoy}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Teléfono *</label>
            <input
              className={inputCls}
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 5492262000000"
              inputMode="tel"
              required
            />
          </div>

          <div>
            <label className={labelCls}>Ubicación en el mapa (opcional)</label>
            {!coords ? (
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-brand/40 bg-brand/5 px-4 py-3 text-sm font-bold text-brand hover:border-brand transition disabled:opacity-60"
              >
                {locating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4" />
                )}
                {locating ? 'Obteniendo ubicación…' : 'Usar mi ubicación'}
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-bold text-green-700">
                  <MapPin className="h-4 w-4" /> Ubicación guardada ✓
                </p>
                <button
                  type="button"
                  onClick={() => setCoords(null)}
                  className="text-xs font-bold text-stone-500 underline hover:text-stone-700"
                >
                  Quitar
                </button>
              </div>
            )}
            {locError && (
              <p className="mt-1.5 text-xs font-semibold text-red-600">{locError}</p>
            )}
            <p className="mt-1.5 text-xs text-stone-400">
              Así tu publicación aparece en el mapa para quienes estén cerca.
            </p>
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
            {submitting ? (editing ? 'Guardando…' : 'Publicando…') : editing ? 'Guardar cambios' : 'Publicar alerta'}
          </button>

          {DEMO_MODE && (
            <p className="text-xs text-stone-400 text-center">Estás en modo demo: la alerta se guarda localmente.</p>
          )}
        </form>
      </div>
    </div>
  )
}
