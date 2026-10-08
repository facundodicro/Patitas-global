import { useState } from 'react'
import { X, Heart, Wallet, Copy, Check, MessageCircle } from 'lucide-react'
import { DONATE_MP_ALIAS, donateLink, hasRealDonateAlias } from '../lib/config'

/**
 * Modal de donación/agradecimiento.
 * - "Donar con Mercado Pago": muestra el alias con botón para copiarlo.
 *   Se oculta automáticamente si no hay un alias real configurado.
 * - "Agradecer por WhatsApp": abre el chat con mensaje pre-cargado.
 */
export default function DonateModal({ open, onClose }) {
  const [copied, setCopied] = useState(false)
  const showMercadoPago = hasRealDonateAlias()

  if (!open) return null

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(DONATE_MP_ALIAS)
    } catch {
      // Fallback para navegadores sin clipboard API
      const ta = document.createElement('textarea')
      ta.value = DONATE_MP_ALIAS
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Donar a Patitas"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-pop animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-soft">
              <Heart className="h-5 w-5 text-accent-dark" fill="currentColor" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-stone-900">Donar a Patitas</h2>
              <p className="text-sm font-bold text-stone-500">
                Tu ayuda mantiene viva esta red solidaria
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full p-2 text-stone-500 transition hover:bg-stone-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {showMercadoPago && (
            <div className="rounded-2xl border border-stone-200 p-5">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-brand" />
                <h3 className="font-extrabold text-stone-900">Donar con Mercado Pago</h3>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <code className="min-w-0 flex-1 select-all truncate rounded-xl bg-stone-100 px-4 py-2.5 font-mono text-sm font-bold text-stone-800">
                  {DONATE_MP_ALIAS}
                </code>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-extrabold text-white transition ${
                    copied ? 'bg-status-encontrado' : 'bg-brand hover:bg-brand-dark'
                  }`}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? '¡Copiado!' : 'Copiar alias'}
                </button>
              </div>
              <p className="mt-2 text-xs font-bold text-stone-500">
                Pegá este alias en la app de Mercado Pago para donar.
              </p>
            </div>
          )}

          <a
            href={donateLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-6 py-3.5 font-extrabold text-white transition hover:brightness-110"
          >
            <MessageCircle className="h-5 w-5" />
            Agradecer por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
