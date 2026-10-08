import QRCode from 'qrcode'

/**
 * Normaliza un teléfono argentino para wa.me.
 * Acepta "2262 00-0000", "02262 15-000000", "+54 9 2262 ..." etc.
 */
export function toWhatsAppNumber(phone) {
  if (!phone) return ''
  let digits = String(phone).replace(/\D/g, '')
  // Quitar el 0 inicial de la característica (ej: 02262 -> 2262)
  if (digits.startsWith('0')) digits = digits.slice(1)
  // Quitar el 15 de los celulares con formato local (ej: 226215000000 -> 2262000000)
  // manteniéndolo simple: si después del 54 hay un 9 ya es formato internacional
  if (digits.startsWith('54')) return digits
  return `54${digits}`
}

export function waLink(phone, text) {
  const number = toWhatsAppNumber(phone)
  const base = number ? `https://wa.me/${number}` : 'https://wa.me/'
  return text ? `${base}?text=${encodeURIComponent(text)}` : base
}

/**
 * Construye el contenido del QR según el destino elegido:
 * - 'ficha': página pública de la mascota (/m/:id)
 * - 'whatsapp': chat directo con el dueño
 * - 'llamada': llamada al teléfono del dueño
 */
export function buildQrContent({ destino = 'ficha', petId, phone, petNombre }) {
  switch (destino) {
    case 'whatsapp':
      return waLink(
        phone,
        `¡Hola! Encontré a ${petNombre || 'tu mascota'} y escaneé su placa Patitas. ¿Es tuya?`,
      )
    case 'llamada':
      return `tel:${String(phone || '').replace(/\D/g, '')}`
    case 'ficha':
    default:
      return `${window.location.origin}/m/${petId}`
  }
}

/** Genera el QR como dataURL PNG lista para <img>. */
export async function qrDataURL(text, width = 640) {
  return QRCode.toDataURL(text, {
    width,
    margin: 2,
    color: { dark: '#1c1917', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  })
}

export const QR_DESTINOS = [
  { value: 'ficha', label: 'Ficha web de la mascota', hint: 'Muestra foto, señas y botón de WhatsApp' },
  { value: 'whatsapp', label: 'WhatsApp directo', hint: 'Abre el chat con el dueño al escanear' },
  { value: 'llamada', label: 'Llamada directa', hint: 'Llama al teléfono del dueño al escanear' },
]
