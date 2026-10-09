import { useEffect, useRef, useState } from 'react'
import { ChevronRight, MessageCircle, Store } from 'lucide-react'
import { listAds } from '../lib/store'
import { waLink } from '../lib/qr'

/**
 * "Red de negocios adheridos": carrusel táctil de publicidades,
 * ubicado encima del footer. Cada tarjeta lleva foto, descripción del
 * negocio y botón de WhatsApp. Se desliza con el dedo (scroll nativo
 * con snap) y avanza solo cada 5 segundos, pausándose al interactuar.
 * Solo el admin carga/edita avisos (panel /admin).
 * Si no hay avisos, no se muestra nada.
 */
const AUTOPLAY_MS = 5000
const RESUME_MS = 8000

function AdCard({ ad }) {
  const text = `¡Hola! Vi tu negocio en la red de Patitas y me interesa.`
  return (
    <article
      data-ad-card
      className="w-72 shrink-0 snap-start overflow-hidden rounded-2xl bg-white shadow-card"
    >      {ad.foto_url ? (
        <img
          src={ad.foto_url}
          alt={ad.titulo}
          loading="lazy"
          className="h-36 w-full object-cover"
        />
      ) : (
        <div className="flex h-36 w-full items-center justify-center bg-brand/10">
          <Store className="h-10 w-10 text-brand/40" aria-hidden="true" />
        </div>
      )}
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-400">
          Publicidad
        </p>
        <h3 className="mt-1 font-extrabold text-stone-900">{ad.titulo}</h3>
        {ad.descripcion && (
          <p className="mt-1 line-clamp-2 text-sm text-stone-600">{ad.descripcion}</p>
        )}
        {ad.whatsapp && (
          <a
            href={waLink(ad.whatsapp, text)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        )}
      </div>
    </article>
  )
}

export default function AdBanner() {
  const [ads, setAds] = useState([])
  const trackRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimer = useRef(null)

  useEffect(() => {
    let mounted = true
    listAds()
      .then((list) => {
        if (mounted) setAds(list || [])
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  // Avance automático que se pausa cuando el usuario interactúa
  useEffect(() => {
    if (ads.length < 2) return undefined
    const id = setInterval(() => {
      const el = trackRef.current
      if (!el || pausedRef.current) return
      const card = el.querySelector('[data-ad-card]')
      const step = card ? card.offsetWidth + 20 : 320 // 20px = gap-5
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10
      if (atEnd) el.scrollTo({ left: 0, behavior: 'smooth' })
      else el.scrollBy({ left: step, behavior: 'smooth' })
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [ads.length])

  useEffect(
    () => () => {
      if (resumeTimer.current) clearTimeout(resumeTimer.current)
    },
    [],
  )

  const pauseAutoplay = () => {
    pausedRef.current = true
    if (resumeTimer.current) clearTimeout(resumeTimer.current)
    resumeTimer.current = setTimeout(() => {
      pausedRef.current = false
    }, RESUME_MS)
  }

  if (ads.length === 0) return null

  return (
    <section
      aria-label="Red de negocios adheridos"
      className="overflow-hidden border-t border-stone-200 bg-stone-100/60 py-10"
    >
      <div className="mx-auto mb-6 max-w-6xl px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/15 text-accent-dark">
            <Store className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-extrabold text-stone-900">
              Red de negocios adheridos
            </h2>
            <p className="text-sm text-stone-500">Comercios que apoyan a Patitas</p>
          </div>
          {ads.length > 1 && (
            <p className="hidden items-center gap-1 text-xs font-bold text-stone-400 sm:inline-flex">
              Deslizá para ver más <ChevronRight className="h-4 w-4" />
            </p>
          )}
        </div>
      </div>

      <div className="relative">
        <div
          ref={trackRef}
          onPointerDown={pauseAutoplay}
          onTouchStart={pauseAutoplay}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-1"
        >
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
        {/* Degradados en los bordes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-stone-100 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-stone-100 to-transparent" />
      </div>
    </section>
  )
}
