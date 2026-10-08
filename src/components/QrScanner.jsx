import { useEffect, useRef, useState } from 'react'
import { X, QrCode, CameraOff } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'

export default function QrScanner() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(null) // 'no-camera'
  const [manual, setManual] = useState(null)
  const scannerRef = useRef(null)
  const stoppingRef = useRef(false)

  const stopScanner = async () => {
    const h = scannerRef.current
    if (!h || stoppingRef.current) return
    stoppingRef.current = true
    try {
      await h.stop()
    } catch (_) {
      // ya detenido o nunca iniciado
    }
    try {
      h.clear()
    } catch (_) {
      // nada que limpiar
    }
    scannerRef.current = null
    stoppingRef.current = false
  }

  useEffect(() => {
    if (!open) return
    setError(null)
    setManual(null)
    stoppingRef.current = false

    const h = new Html5Qrcode('qr-reader')
    scannerRef.current = h

    const onScan = (decodedText) => {
      stopScanner().then(() => {
        if (typeof decodedText === 'string' && decodedText.startsWith('http')) {
          window.location.href = decodedText
        } else {
          setManual(decodedText)
        }
      })
    }

    Html5Qrcode.getCameras()
      .then((cams) => {
        if (cams && cams.length > 0) {
          h.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } }, onScan, () => {})
            .catch(() => setError('no-camera'))
        } else {
          setError('no-camera')
        }
      })
      .catch(() => setError('no-camera'))

    return () => {
      stopScanner()
    }
  }, [open ])

  const handleClose = () => {
    stopScanner().then(() => setOpen(false))
  }

  const handleRetry = () => {
    setError(null)
    setManual(null)
    // re-dispara el useEffect cerrando y abriendo
    setOpen(false)
    setTimeout(() => setOpen(true), 50)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
        className="fixed z-40 right-5 h-14 w-14 rounded-full bg-brand text-white shadow-pop flex items-center justify-center hover:bg-brand-light transition"
        aria-label="Escanear placa QR"
      >
        <QrCode className="h-6 w-6" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <div
            className="bg-white rounded-2xl shadow-pop w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-stone-900">Escanear placa</h2>
              <button
                type="button"
                onClick={handleClose}
                className="p-2 -m-2 text-stone-400 hover:text-stone-700 transition"
                aria-label="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error === 'no-camera' ? (
              <div className="text-center py-8 animate-fade-in">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-stone-100 flex items-center justify-center">
                  <CameraOff className="h-8 w-8 text-stone-400" />
                </div>
                <h3 className="font-extrabold text-lg text-stone-900 mb-2">
                  No encontramos una cámara disponible
                </h3>
                <p className="text-sm text-stone-500 mb-6">
                  Revisá los permisos de cámara de tu navegador o probá en otro dispositivo.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="rounded-xl bg-brand hover:bg-brand-light text-white font-extrabold px-6 py-2.5 shadow-card transition"
                  >
                    Reintentar
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-xl border-2 border-stone-200 hover:border-brand text-stone-700 hover:text-brand font-extrabold px-6 py-2.5 transition"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            ) : manual ? (
              <div className="text-center py-8 animate-fade-in">
                <h3 className="font-extrabold text-lg text-stone-900 mb-2">Código detectado</h3>
                <p className="text-sm text-stone-500 break-all bg-stone-50 rounded-xl px-4 py-3 mb-6">
                  {manual}
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border-2 border-stone-200 hover:border-brand text-stone-700 hover:text-brand font-extrabold px-6 py-2.5 transition"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <div id="qr-reader" className="overflow-hidden rounded-xl" />
                <p className="mt-4 text-sm text-stone-500 text-center">
                  Apuntá la cámara al código QR de la placa para ver la ficha de la mascota.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
