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
 * Marca real de Patitas: huella SVG + wordmark en Nunito 800.
 * `variant="light"` para usar sobre fondos oscuros.
 */
export function PawMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="22" fill="#0F766E" />
      {/* almohadilla */}
      <path
        d="M24 34.5c-4.6 0-8.6-3.1-8.6-6.9 0-2.5 1.9-4.2 4.3-5.2 1.4-.6 2.9-.9 4.3-.9s2.9.3 4.3.9c2.4 1 4.3 2.7 4.3 5.2 0 3.8-4 6.9-8.6 6.9Z"
        fill="#fff"
      />
      {/* dedos */}
      <ellipse cx="13.5" cy="20.5" rx="3.1" ry="4" fill="#fff" transform="rotate(-18 13.5 20.5)" />
      <ellipse cx="20" cy="14.5" rx="3.1" ry="4" fill="#fff" transform="rotate(-6 20 14.5)" />
      <ellipse cx="28" cy="14.5" rx="3.1" ry="4" fill="#fff" transform="rotate(6 28 14.5)" />
      <ellipse cx="34.5" cy="20.5" rx="3.1" ry="4" fill="#fff" transform="rotate(18 34.5 20.5)" />
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
