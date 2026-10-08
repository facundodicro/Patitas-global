import { useState } from 'react'
import { Heart } from 'lucide-react'
import DonateModal from './DonateModal'

/**
 * Botón cálido "Donar" / "Agradecer": abre el modal de donación
 * (Mercado Pago + WhatsApp). La configuración vive en src/lib/config.js
 * (DONATE_MP_ALIAS, DONATE_WHATSAPP) o en las variables
 * VITE_DONATE_MP_ALIAS / VITE_DONATE_WHATSAPP.
 */
export default function DonateButton({ label = 'Agradecer', className = '' }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-accent-soft px-4 py-2 text-sm font-extrabold text-accent-dark transition hover:bg-accent hover:text-white ${className}`}
      >
        <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
        {label}
      </button>
      <DonateModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
