/**
 * Configuración general de Patitas: donaciones y agradecimientos.
 *
 * DONATE_MP_ALIAS: alias de Mercado Pago del creador de la app (Facundo).
 * 👉 Para cambiarlo, editá el valor por defecto acá abajo o definí la
 * variable de entorno VITE_DONATE_MP_ALIAS (en el .env o en Vercel).
 * Si el alias está vacío, la opción de Mercado Pago se oculta
 * automáticamente del modal (no se muestran datos falsos).
 *
 * DONATE_WHATSAPP: número de WhatsApp del creador, formato wa.me SIN "+"
 * ni espacios.
 * 👉 Para cambiarlo, editá el valor por defecto acá abajo o definí la
 * variable de entorno VITE_DONATE_WHATSAPP.
 */

export const MP_ALIAS_PLACEHOLDER = 'patitas.donaciones.mp'
export const WHATSAPP_PLACEHOLDER = '5490000000000'

export const DONATE_MP_ALIAS =
  import.meta.env.VITE_DONATE_MP_ALIAS || 'facundo.9dejulio'

export const DONATE_WHATSAPP =
  import.meta.env.VITE_DONATE_WHATSAPP || '5492262591262'

/** true si hay un alias de Mercado Pago real configurado */
export function hasRealDonateAlias() {
  return Boolean(DONATE_MP_ALIAS) && DONATE_MP_ALIAS !== MP_ALIAS_PLACEHOLDER
}

/** Mensaje pre-cargado del botón de agradecimiento por WhatsApp */
export const DONATE_MESSAGE = 'Hola, quiero agradecer a Patitas'

/** Link de WhatsApp con mensaje pre-cargado */
export function donateLink(message = DONATE_MESSAGE) {
  return `https://wa.me/${DONATE_WHATSAPP}?text=${encodeURIComponent(message)}`
}
