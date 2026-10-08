import { X, Smartphone, Share, Plus, MoreVertical, Download, MonitorSmartphone } from 'lucide-react'

function detectPlatform() {
  const ua = navigator.userAgent || ''
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios'
  if (/android/i.test(ua)) return 'android'
  return 'desktop'
}

const STEPS = {
  ios: [
    { icon: Share, text: 'Tocá el botón Compartir de Safari' },
    { icon: Plus, text: "Elegí 'Añadir a pantalla de inicio'" },
    { icon: Plus, text: "Confirmá con 'Añadir'" },
  ],
  android: [
    { icon: MoreVertical, text: 'Abrí el menú de Chrome' },
    { icon: Download, text: "Tocá 'Instalar app' o 'Añadir a pantalla de inicio'" },
    { icon: Download, text: 'Confirmá la instalación' },
  ],
  desktop: [
    { icon: MoreVertical, text: 'Abrí el menú de tu navegador' },
    { icon: Download, text: "Elegí 'Instalar Patitas…'" },
    { icon: MonitorSmartphone, text: 'La app queda como ventana propia' },
  ],
}

export default function InstallModal({ open, onClose }) {
  if (!open) return null

  const platform = detectPlatform()
  const steps = STEPS[platform]

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
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
              <Smartphone className="h-6 w-6 text-brand" />
            </div>
            <h2 className="text-xl font-extrabold text-stone-900">
              Instalá Patitas en tu dispositivo
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-2 text-stone-400 hover:text-stone-700 transition"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="space-y-3 mt-5">
          {steps.map((step, i) => (
            <li
              key={i}
              className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3"
            >
              <span className="h-8 w-8 rounded-full bg-brand text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <span className="flex-1 text-sm font-bold text-stone-800">{step.text}</span>
              <step.icon className="h-5 w-5 text-brand shrink-0" />
            </li>
          ))}
        </ol>

        <p className="mt-5 text-sm text-stone-500 text-center">
          Funciona sin ocupar casi espacio y abre directo en tu mascota.
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-xl bg-brand hover:bg-brand-light text-white font-extrabold py-3 shadow-card transition"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}
