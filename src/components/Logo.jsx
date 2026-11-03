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
      <rect x="1.68" y="1.68" width="44.64" height="44.64" rx="9.84" fill="#14532D" />
      {/* pin gota crema: elipse rellena + punta */}
      <polygon points="15.12,25.68 32.88,25.68 24,41.28" fill="#F8EEDB" />
      <ellipse cx="24" cy="18" rx="12" ry="13.92" fill="#F8EEDB" />
      {/* placa blanca del QR */}
      <rect x="16.94" y="10.94" width="14.11" height="14.11" rx="1.83" fill="#fff" />
      {/* QR simplificado: cuadrados gruesos y separados, se lee en chico */}
      <rect x="18.64" y="12.64" width="4.66" height="4.66" fill="#0A0A0A" />
      <rect x="24.70" y="12.64" width="4.66" height="4.66" fill="#0A0A0A" />
      <rect x="18.64" y="18.70" width="4.66" height="4.66" fill="#0A0A0A" />
      <rect x="24.70" y="18.70" width="2.82" height="2.82" fill="#0A0A0A" />
      <rect x="27.67" y="21.67" width="1.69" height="1.69" fill="#0A0A0A" />
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
