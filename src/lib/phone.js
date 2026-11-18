/* Validación compartida de teléfonos / WhatsApp en los formularios.
   Regla: solo dígitos (se ignoran espacios, guiones y el +), entre 10 y 15:
   código de país + código de área + número. */
export const PHONE_ERROR =
  'Revisá el número: va con código de país y área, solo números (ej: 5492262000000).'

export function phoneDigits(value) {
  return String(value || '').replace(/\D/g, '')
}

export function isValidPhone(value) {
  const len = phoneDigits(value).length
  return len >= 10 && len <= 15
}
