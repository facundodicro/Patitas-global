import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * Las letras aparecen una por una (entrada lenta) cada N segundos,
 * y la palabra queda con un halo marcado que la resalta.
 * Solo se usa en el header para no sobrecargar el resto de la app.
 */
const WORD_CYCLE_MS = 7000
const LETTER_STAGGER_MS = 120

function AnimatedWord({ text, className = '' }) {
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCycle((c) => c + 1), WORD_CYCLE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <span className={`word-glow-wrap ${className}`} role="text" aria-label={text}>
      {text.split('').map((ch, i) => (
        <span
          key={`${cycle}-${i}`}
          className="word-letter"
          style={{ animationDelay: `${i * LETTER_STAGGER_MS}ms` }}
          aria-hidden="true"
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

/**
 * Marca de Patitas (desde nov 2026): lupa de costado crema con un QR
 * adentro de la lente, sobre el color de la app (teal #0F766E).
 * Reemplaza a la huellita genérica original. Wordmark en Nunito 800.
 * `variant="light"` para usar sobre fondos oscuros.
 * (El export conserva el nombre PawMark por compatibilidad con los
 * componentes que ya lo importan.)
 */
export function PawMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* fondo: el color de la app */}
      <rect x="1.68" y="1.68" width="44.64" height="44.64" rx="9.84" fill="#0F766E" />
      {/* lupa de costado crema: mango a 45° + aro de la lente */}
      <line x1="29.48" y1="29.96" x2="34.06" y2="34.54" stroke="#F8EEDB" strokeWidth="4.22" strokeLinecap="round" />
      <circle cx="21.84" cy="22.32" r="12.24" fill="#F8EEDB" />
      <circle cx="21.84" cy="22.32" r="8.98" fill="#0F766E" />
      {/* placa blanca del QR, grande: casi toca los bordes de la lente */}
      <rect x="15.72" y="16.20" width="12.24" height="12.24" rx="1.59" fill="#fff" />
      {/* QR simplificado: cuadrados chicos con aire, no se apelmaza en chico */}
      <rect x="18.43" y="18.91" width="2.78" height="2.78" fill="#0A0A0A" />
      <rect x="22.46" y="18.91" width="2.78" height="2.78" fill="#0A0A0A" />
      <rect x="18.43" y="22.94" width="2.78" height="2.78" fill="#0A0A0A" />
      <rect x="22.46" y="22.94" width="1.68" height="1.68" fill="#0A0A0A" />
      <rect x="24.19" y="24.67" width="1.01" height="1.01" fill="#0A0A0A" />
    </svg>
  )
}

export default function Logo({ variant = 'dark', compact = false, animated = false }) {
  const textColor = variant === 'light' ? 'text-white' : 'text-stone-900'
  return (
    <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="Patitas - Inicio">
      <PawMark className={compact ? 'h-8 w-8' : 'h-10 w-10'} />
      <span className={`font-extrabold tracking-tight leading-none ${textColor}`}>
        {animated && !compact ? (
          <AnimatedWord text="Patitas" className="text-2xl" />
        ) : (
          <span className={compact ? 'text-xl' : 'text-2xl'}>Patitas</span>
        )}
        {!compact && (
          <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-brand-light">
            Red solidaria
          </span>
        )}
      </span>
    </Link>
  )
}
