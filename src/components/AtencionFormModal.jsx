import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { createAtencion } from '../lib/store'

const TIPOS = [
  { value: 'vacuna', label: 'Vacuna', cls: 'bg-emerald-100 text-emerald-800' },
  { value: 'tratamiento', label: 'Tratamiento', cls: 'bg-amber-100 text-amber-800' },
  { value: 'visita', label: 'Visita', cls: 'bg-sky-100 text-sky-800' },
  { value: 'cirugia', label: 'Cirugía', cls: 'bg-rose-100 text-rose-800' },
  { value: 'otro', label: 'Otro', cls: 'bg-stone-200 text-stone-700' },
]

export default function AtencionFormModal({ open, onClose, onSaved, mascotaId, veterinariaId }) {
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
