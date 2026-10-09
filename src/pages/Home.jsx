import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, QrCode, Store, UserPlus } from 'lucide-react'
import { PawMark } from '../components/Logo'
import BoardSection from '../components/BoardSection'
import DonateButton from '../components/DonateButton'
import LikeButton from '../components/LikeButton'
import MapSection from '../components/MapSection'
import ReportModal from '../components/ReportModal'
import { listReports, listAds, updateReportEstado, deleteReport, DEMO_MODE } from '../lib/store'
import { useAuth } from '../hooks/useAuth'
import { waLink } from '../lib/qr'

// Cuadrícula pseudo-QR decorativa (patrón fijo para que sea estable entre renders)
const QR_PATTERN = [
  [1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],
  [1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1],
]
const QR_FILL = [0,1,1,0,1,0,0,1,0,1,1,0,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1]

function FakeQr() {
  const cells = []
  QR_PATTERN.forEach((row, r) =>
    row.forEach((v, c) => cells.push({ key: `m${r}-${c}`, v, border: r === 0 || r === 6 || c === 0 || c === 6 })),
  )
  QR_FILL.forEach((v, i) => cells.push({ key: `f${i}`, v, inner: true }))
  return (
    <div className="grid grid-cols-7 gap-0.5 rounded-lg bg-white p-2 w-32 h-32" aria-hidden="true">
      {cells.map((cell) => (
        <div
          key={cell.key}
          className={`rounded-[2px] ${cell.v ? 'bg-stone-900' : 'bg-stone-100'}`}
        />
      ))}
    </div>
  )
}

function Paso({ icon, title, text, color }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 shadow-card">
      <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl text-white ${color}`}>
        {icon}
      </div>
      <h3 className="text-lg font-extrabold text-stone-900">{title}</h3>
      <p className="mt-1 text-stone-600">{text}</p>
    </div>
  )
}

export default function Home() {
  const { user, isAdmin } = useAuth()
  const [reports, setReports] = useState([])
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [editingReport, setEditingReport] = useState(null)
  const [focus, setFocus] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const [reps, adsList] = await Promise.all([listReports(), listAds()])
        if (mounted) {
          setReports(reps)
          setAds(adsList)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const enBusqueda = reports.filter((r) => r.estado === 'perdida').length
  const reunidas = reports.filter((r) => r.estado === 'en_casa').length
  const publicadas = reports.length

  function handleLocate(report) {
    setFocus({ lat: report.lat, lng: report.lng })
    document.querySelector('#mapa')?.scrollIntoView({ behavior: 'smooth' })
  }

  /** Marca un reporte como reunido ("en casa") y actualiza la lista local. */
  async function handleMarkReunited(report) {
    await updateReportEstado(report.id, 'en_casa')
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, estado: 'en_casa' } : r)),
    )
  }

  /** Elimina un reporte y lo quita de la lista local. */
  async function handleDeleteReport(id) {
    await deleteReport(id)
    setReports((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="animate-fade-up">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
              Red solidaria de mascotas
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              Si se pierde tu mejor amigo, Patitas lo conecta directo con vos.
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Creá el perfil de tu mascota, descargá su placa con código QR para el collar y, si se
              pierde, quien la encuentre te avisa por WhatsApp al instante.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/perfil"
                className="rounded-full bg-accent px-6 py-3 font-extrabold text-white transition hover:bg-accent-dark"
              >
                Creá el perfil de tu mascota
              </Link>
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="rounded-full border-2 border-white/80 px-6 py-3 font-extrabold text-white transition hover:bg-white/10"
              >
                Reportar mascota perdida
              </button>
              <DonateButton
                label="Donar"
                className="donate-glow border-2 border-white/80 !bg-transparent px-6 py-3 !text-white hover:!bg-white/10"
              />
            </div>
            {!loading && (
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <p className="text-sm font-bold text-white/85">
                  {enBusqueda} en búsqueda activa · {reunidas} reunidas · {publicadas} reportes publicados
                </p>
                <LikeButton />
              </div>
            )}
          </div>

          {/* Visual decorativo: placa QR */}
          <div className="mx-auto w-full max-w-sm rotate-2" aria-hidden="true">
            <div className="rounded-3xl bg-white p-6 text-stone-900 shadow-pop">
              <div className="flex items-center gap-4">
                <FakeQr />
                <div>
                  <PawMark className="h-10 w-10 text-brand" />
                  <p className="mt-2 text-2xl font-extrabold">Milo</p>
                  <p className="text-sm text-stone-500">Si me perdí, escaneame</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-status-encontrado/10 px-4 py-2 text-sm font-bold text-status-encontrado">
                <MessageCircle className="h-4 w-4" />
                WhatsApp del dueño conectado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PATROCINADOR DESTACADO */}
      {ads.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="relative overflow-hidden rounded-3xl bg-white shadow-card">
            <span className="absolute right-4 top-4 z-10 rounded-full bg-stone-900/70 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
              Patrocinado
            </span>
            <div className="grid md:grid-cols-2">
              {ads[0].foto_url ? (
                <img
                  src={ads[0].foto_url}
                  alt={ads[0].titulo}
                  className="h-56 w-full object-cover md:h-full md:min-h-[280px]"
                />
              ) : (
                <div className="flex h-56 items-center justify-center bg-brand/10 md:h-full md:min-h-[280px]">
                  <Store className="h-12 w-12 text-brand/40" aria-hidden="true" />
                </div>
              )}
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <h3 className="text-2xl font-extrabold text-stone-900">{ads[0].titulo}</h3>
                {ads[0].descripcion && (
                  <p className="mt-2 text-stone-600">{ads[0].descripcion}</p>
                )}
                {ads[0].whatsapp && (
                  <a
                    href={waLink(ads[0].whatsapp, `¡Hola! Vi su publicidad en Patitas. (${ads[0].titulo})`)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-extrabold text-white transition hover:brightness-95"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-stone-900">Cómo funciona</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Paso
              icon={<UserPlus className="h-6 w-6" />}
              color="bg-brand"
              title="Registrá a tu mascota"
              text="Creá su perfil con foto y tus datos de contacto."
            />
            <Paso
              icon={<QrCode className="h-6 w-6" />}
              color="bg-accent"
              title="Imprimí su placa QR"
              text="Descargá la placa y colgala del collar."
            />
            <Paso
              icon={<MessageCircle className="h-6 w-6" />}
              color="bg-status-encontrado"
              title="Te contactan por WhatsApp"
              text="Quien la encuentre te avisa al instante."
            />
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section id="mapa" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-14">
        <h2 className="text-3xl font-extrabold text-stone-900">Mapa comunitario</h2>
        <p className="mt-2 text-stone-600">Mascotas perdidas y encontradas en tu zona.</p>
        <div className="mt-6">
          <MapSection reports={reports} focus={focus} />
        </div>
      </section>

      {/* TABLÓN */}
      <section id="tablon" className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <BoardSection
            reports={reports}
            loading={loading}
            onLocate={handleLocate}
            user={user}
            isAdmin={isAdmin}
            onMarkReunited={handleMarkReunited}
            onDeleteReport={handleDeleteReport}
            onEditReport={setEditingReport}
          />
        </div>
      </section>

      <ReportModal
        open={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onCreated={(r) => setReports((prev) => [r, ...prev])}
      />

      <ReportModal
        open={!!editingReport}
        editing={editingReport}
        onClose={() => setEditingReport(null)}
        onSaved={(updated) =>
          setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
        }
      />
    </div>
  )
}
