import { useEffect, useState } from 'react'
import { X, Download, Printer, Link2, AlertTriangle, Check } from 'lucide-react'
import Logo, { PawMark } from './Logo'
import { buildQrContent, qrDataURL } from '../lib/qr'

export default function QrPlateModal({ open, onClose, pet, ownerPhone }) {
  const [qrImg, setQrImg] = useState(null)
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!open || !pet) return
    const c = buildQrContent({
      destino: pet.qr_destino || 'ficha',
      petId: pet.id,
      phone: ownerPhone,
      petNombre: pet.nombre,
    })
    setContent(c)
    qrDataURL(c, 640)
      .then(setQrImg)
      .catch(() => setQrImg(null))
  }, [open, pet, ownerPhone])

  if (!open || !pet) return null

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  const drawPawFallback = (ctx, cx, cy, r) => {
    ctx.save()
    ctx.fillStyle = '#CCFBF1'
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    // almohadilla principal
    ctx.beginPath()
    ctx.ellipse(cx, cy + r * 0.25, r * 0.42, r * 0.34, 0, 0, Math.PI * 2)
    ctx.fill()
    // 4 dedos
    const toes = [
      [-0.48, -0.28],
      [-0.17, -0.45],
      [0.17, -0.45],
      [0.48, -0.28],
    ]
    toes.forEach(([dx, dy]) => {
      ctx.beginPath()
      ctx.arc(cx + dx * r, cy + dy * r, r * 0.16, 0, Math.PI * 2)
      ctx.fill()
    })
    ctx.restore()
  }

  const handleDownload = async () => {
    try {
      await document.fonts.ready
    } catch (_) {
      // seguir igual si las fuentes no cargan
    }
    const W = 1080
    const H = 1350
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')

    // fondo
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, W, H)

    // franja superior teal
    ctx.fillStyle = '#0F766E'
    ctx.fillRect(0, 0, W, 220)
    ctx.fillStyle = '#FFFFFF'
    ctx.font = "700 54px Nunito, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('PATITAS · SI ME PERDÍ, ESCANEAME', W / 2, 110)

    // foto circular
    const cx = W / 2
    const cy = 420
    const r = 130
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.clip()
    if (pet.foto_url) {
      try {
        const img = await loadImage(pet.foto_url)
        const s = Math.max((r * 2) / img.width, (r * 2) / img.height)
        const dw = img.width * s
        const dh = img.height * s
        ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh)
      } catch (_) {
        ctx.restore()
        drawPawFallback(ctx, cx, cy, r)
        ctx.save()
      }
    } else {
      drawPawFallback(ctx, cx, cy, r)
    }
    ctx.restore()
    ctx.save()
    ctx.strokeStyle = '#0F766E'
    ctx.lineWidth = 8
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()

    // nombre
    ctx.fillStyle = '#1C1917'
    ctx.font = "800 72px Nunito, sans-serif"
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(pet.nombre, W / 2, 700)

    // QR
    if (qrImg) {
      try {
        const qr = await loadImage(qrImg)
        ctx.drawImage(qr, W / 2 - 280, 780, 560, 560)
      } catch (_) {
        // sin QR dibujado
      }
    }

    // pie
    ctx.fillStyle = '#57534E'
    ctx.font = "600 40px Nunito, sans-serif"
    ctx.fillText('Avisá a mi dueño por WhatsApp', W / 2, 1230)
    if (ownerPhone) {
      ctx.fillStyle = '#0F766E'
      ctx.font = "700 40px Nunito, sans-serif"
      ctx.fillText(ownerPhone, W / 2, 1285)
    }

    const a = document.createElement('a')
    a.download = `placa-${pet.nombre}.png`
    a.href = canvas.toDataURL('image/png')
    a.click()
  }

  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Placa QR - ${pet.nombre}</title>
<style>
  body { margin: 0; display: flex; justify-content: center; background: #fff; font-family: Nunito, sans-serif; }
  .plate { width: 380px; border: 2px solid #0F766E; border-radius: 24px; overflow: hidden; margin: 24px; }
  .band { background: #0F766E; color: #fff; text-align: center; padding: 18px; font-weight: 800; font-size: 18px; letter-spacing: 2px; }
  .body { padding: 24px; text-align: center; }
  .photo { width: 140px; height: 140px; border-radius: 50%; object-fit: cover; border: 4px solid #0F766E; }
  .name { font-size: 30px; font-weight: 800; margin: 12px 0 4px; color: #1C1917; }
  .qr { width: 240px; height: 240px; margin: 12px auto; display: block; }
  .scan { font-weight: 800; font-size: 18px; color: #1C1917; }
  .wa { color: #57534E; font-size: 14px; margin-top: 6px; }
  .phone { color: #0F766E; font-weight: 800; font-size: 16px; }
  @media print { .plate { margin: 0; border-width: 3px; } }
</style>
</head>
<body>
  <div class="plate">
    <div class="band">PATITAS</div>
    <div class="body">
      ${pet.foto_url ? `<img class="photo" src="${pet.foto_url}" alt="${pet.nombre}">` : ''}
      <div class="name">${pet.nombre}</div>
      ${qrImg ? `<img class="qr" src="${qrImg}" alt="QR">` : ''}
      <div class="scan">Si me perdí, escaneame</div>
      <div class="wa">Avisá a mi dueño por WhatsApp</div>
      ${ownerPhone ? `<div class="phone">${ownerPhone}</div>` : ''}
    </div>
  </div>
  <script>window.onload = () => window.print()</script>
</body>
</html>`)
    win.document.close()
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {
      // portapapeles no disponible
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-pop w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-stone-900">Placa QR de {pet.nombre}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -m-2 text-stone-400 hover:text-stone-700 transition"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!ownerPhone && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            Agregá tu WhatsApp en Mi perfil para que el QR funcione.
          </div>
        )}

        {/* Vista previa de la placa */}
        <div className="flex justify-center mb-5">
          <div className="w-full max-w-xs overflow-hidden rounded-2xl border-2 border-brand bg-white shadow-card">
            <div className="bg-brand text-white text-center py-3 px-4 flex items-center justify-center gap-2">
              <PawMark className="h-6 w-6" />
              <span className="font-extrabold tracking-widest text-lg">PATITAS</span>
            </div>
            <div className="p-5 text-center">
              {pet.foto_url ? (
                <img
                  src={pet.foto_url}
                  alt={pet.nombre}
                  className="mx-auto h-28 w-28 rounded-full object-cover border-4 border-brand"
                />
              ) : (
                <div className="mx-auto h-28 w-28 rounded-full bg-brand-soft border-4 border-brand flex items-center justify-center">
                  <PawMark className="h-12 w-12 text-brand" />
                </div>
              )}
              <p className="mt-3 font-extrabold text-2xl text-stone-900">{pet.nombre}</p>
              {qrImg && (
                <img src={qrImg} alt="Código QR de la placa" className="mx-auto mt-3 w-48 h-48" />
              )}
              <p className="mt-3 font-bold text-stone-900">Si me perdí, escaneame</p>
              <p className="text-sm text-stone-500 mt-1">Avisá a mi dueño por WhatsApp</p>
              {ownerPhone && <p className="font-extrabold text-brand">{ownerPhone}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-dark text-white font-extrabold py-3 shadow-card transition"
          >
            <Download className="h-5 w-5" />
            Descargar PNG
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-stone-200 hover:border-brand text-stone-700 hover:text-brand font-extrabold py-3 transition"
          >
            <Printer className="h-5 w-5" />
            Imprimir
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-stone-200 hover:border-brand text-stone-700 hover:text-brand font-extrabold py-3 transition"
          >
            {copied ? <Check className="h-5 w-5 text-status-encontrado" /> : <Link2 className="h-5 w-5" />}
            {copied ? '¡Enlace copiado!' : 'Copiar enlace'}
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <Logo className="h-6" />
        </div>
      </div>
    </div>
  )
}
