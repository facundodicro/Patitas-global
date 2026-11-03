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
 * Marca de Patitas (desde nov 2026): pin de ubicación crema con un QR
 * adentro, sobre el verde propio de Patitas (#14532D). Reemplaza a la
 * huellita genérica original. Wordmark en Nunito 800.
 * `variant="light"` para usar sobre fondos oscuros.
 * (El export conserva el nombre PawMark por compatibilidad con los
 * componentes que ya lo importan.)
 */
export function PawMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      {/* fondo verde */}
      <rect x="1.68" y="1.68" width="44.64" height="44.64" rx="8.88" fill="#14532D" />
      {/* pin de ubicación crema */}
      <polygon points="15,23.14 33,23.14 24,38.21" fill="#F8EEDB" />
      <circle cx="24" cy="17.75" r="10.49" fill="#F8EEDB" />
      {/* placa blanca del QR */}
      <rect x="18.34" y="12.09" width="11.33" height="11.33" rx="1.59" fill="#fff" />
      {/* QR simplificado */}
      <rect x="20.09" y="13.84" width="3.57" height="3.57" fill="#0A0A0A" />
      <rect x="24.34" y="13.84" width="3.57" height="3.57" fill="#0A0A0A" />
      <rect x="20.09" y="18.09" width="3.57" height="3.57" fill="#0A0A0A" />
      <rect x="24.51" y="18.26" width="1.98" height="1.98" fill="#0A0A0A" />
      <rect x="26.89" y="20.64" width="1.19" height="1.19" fill="#0A0A0A" />
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
