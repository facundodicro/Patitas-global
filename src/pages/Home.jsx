import { Link } from 'react-router-dom'
import { BellRing, HeartPulse, QrCode, ScanLine, Smartphone, UserPlus } from 'lucide-react'
import { PawMark } from '../components/Logo'

const VENTA_WHATSAPP = '5492262591262'
const ventaLink = (texto) =>
  `https://wa.me/${VENTA_WHATSAPP}?text=${encodeURIComponent(texto)}`

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

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        {icon}
      </div>
      <h3 className="text-lg font-extrabold text-stone-900">{title}</h3>
      <p className="mt-1 text-stone-600">{text}</p>
    </div>
  )
}

export default function Home() {
  return (
    <div className="animate-fade-up">
      {/* HERO */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-bold">
              Para veterinarias
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              La historia clínica de tus pacientes en un QR
            </h1>
            <p className="mt-4 text-lg text-white/85">
              Registrá cada mascota, generá su QR para el collar y llevá su ficha médica
              completa: vacunas, tratamientos y visitas, siempre a mano.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={ventaLink('Hola! Me interesa Patitas para mi veterinaria')}
                target="_blank"
                rel="noreferrer"
                className="rounded-full bg-accent px-6 py-3 font-extrabold text-white transition hover:bg-accent-dark"
              >
                Quiero mi veterinaria
              </a>
              <a
                href="#como-funciona"
                className="rounded-full border-2 border-white/80 px-6 py-3 font-extrabold text-white transition hover:bg-white/10"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>

          {/* Visual decorativo: QR */}
          <div className="mx-auto w-full max-w-sm rotate-2" aria-hidden="true">
            <div className="rounded-3xl bg-white p-6 text-stone-900 shadow-pop">
              <div className="flex items-center gap-4">
                <FakeQr />
                <div>
                  <PawMark className="h-10 w-10 text-brand" />
                  <p className="mt-2 text-2xl font-extrabold">Coco</p>
                  <p className="text-sm text-stone-500">Paciente de Veterinaria Huellas</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-sm font-bold text-brand-dark">
                <HeartPulse className="h-4 w-4" />
                3 vacunas · 2 visitas registradas
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="scroll-mt-20 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-stone-900">Cómo funciona</h2>
          <p className="mt-2 text-stone-600">
            En minutos tu consultorio queda funcionando.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Paso
              icon={<UserPlus className="h-6 w-6" />}
              color="bg-brand"
              title="1. Registrás a tu paciente"
              text="Cargás sus datos, su foto y los datos de su dueño."
            />
            <Paso
              icon={<QrCode className="h-6 w-6" />}
              color="bg-accent"
              title="2. Generás su QR"
              text="Descargás el QR listo para imprimir y colgar del collar."
            />
            <Paso
              icon={<ScanLine className="h-6 w-6" />}
              color="bg-status-encontrado"
              title="3. Escaneás y cargás cada atención"
              text="Cada visita queda en su historial: vacunas, tratamientos y más."
            />
          </div>
        </div>
      </section>

      {/* PARA LA VETERINARIA */}
      <section className="bg-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-3xl font-extrabold text-stone-900">Todo tu consultorio, en el bolsillo</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <Feature
              icon={<HeartPulse className="h-6 w-6" />}
              title="Ficha médica privada"
              text="Vacunas, tratamientos, cirugías y notas internas. Solo tu equipo la ve."
            />
            <Feature
              icon={<ScanLine className="h-6 w-6" />}
              title="Historial completo"
              text="Cada atención queda registrada con fecha. Si el paciente vuelve en un año, su historia sigue ahí."
            />
            <Feature
              icon={<QrCode className="h-6 w-6" />}
              title="Un QR por paciente"
              text="Escaneás el collar y se abre su ficha al instante. Sin buscar carpetas ni planillas."
            />
          </div>
        </div>
      </section>

      {/* PARA LOS DUEÑOS */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="inline-block rounded-full bg-brand-soft px-4 py-1 text-sm font-bold text-brand-dark">
                ¿Sos dueño?
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-stone-900">
                Tu mascota también gana
              </h2>
              <p className="mt-3 text-stone-600">
                Si tu veterinaria usa Patitas, recibís gratis:
              </p>
              <ul className="mt-5 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-stone-900">Carnet digital de vacunas</p>
                    <p className="text-sm text-stone-600">
                      El carnet sanitario en tu celu: vacunas aplicadas y próximas dosis.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <BellRing className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-stone-900">Recordatorios por WhatsApp</p>
                    <p className="text-sm text-stone-600">
                      Te avisamos cuando toca la próxima vacuna o tratamiento.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <QrCode className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-extrabold text-stone-900">QR que la trae de vuelta</p>
                    <p className="text-sm text-stone-600">
                      Si se pierde, quien escanee su QR contacta a tu veterinaria al instante.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="mt-8 rounded-3xl bg-brand-faint p-6">
                <p className="font-extrabold text-stone-900">
                  ¿Tu veterinaria no usa Patitas todavía?
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  Registrá a tu mascota vos mismo, gratis: creás su ficha y descargás
                  su QR para el collar. Si se pierde, te avisan a vos por WhatsApp.
                </p>
                <Link
                  to="/registrar-mascota"
                  className="mt-4 inline-block rounded-full bg-brand px-6 py-3 font-extrabold text-white transition hover:bg-brand-dark"
                >
                  Registrá a tu mascota gratis
                </Link>
              </div>
            </div>
            <div className="mx-auto w-full max-w-sm -rotate-2" aria-hidden="true">
              <div className="rounded-3xl bg-white p-6 text-stone-900 shadow-pop ring-1 ring-stone-200">
                <p className="text-xs font-extrabold uppercase tracking-widest text-stone-400">
                  Carnet digital
                </p>
                <p className="mt-2 text-2xl font-extrabold">Coco</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                    <span className="font-bold text-emerald-800">Antirrábica</span>
                    <span className="text-emerald-600">Aplicada</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2">
                    <span className="font-bold text-amber-800">Séxtuple</span>
                    <span className="text-amber-600">Próxima: en 2 meses</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2">
                    <span className="font-bold text-emerald-800">Desparasitación</span>
                    <span className="text-emerald-600">Aplicada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-br from-brand-dark via-brand to-brand-light text-white">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            Tus pacientes fidelizados, tu agenda completa
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
            Escribinos y te mostramos cómo Patitas trabaja para tu veterinaria.
          </p>
          <a
            href={ventaLink('Hola! Me interesa Patitas para mi veterinaria')}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-accent px-8 py-4 text-lg font-extrabold text-white transition hover:bg-accent-dark"
          >
            Quiero mi veterinaria
          </a>
        </div>
      </section>
    </div>
  )
}
