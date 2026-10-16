import { Check, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { waLink } from '../lib/qr';
import { DONATE_WHATSAPP } from '../lib/config';

const BENEFICIOS = [
  'Ficha médica privada de cada paciente.',
  'Historial completo de vacunas y tratamientos.',
  'QR por paciente: escaneás y se abre su ficha.',
  'Carnet digital y recordatorios para tus clientes.',
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            Patitas es la herramienta de las veterinarias: la historia clínica de cada
            paciente en un QR, y un carnet digital para sus dueños.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
            Para tu veterinaria
          </h3>
          <ul className="mt-4 space-y-3">
            {BENEFICIOS.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-stone-400">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">Ayuda</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="mailto:ayuda@patitas.com.ar?subject=Reportar%20un%20problema%20en%20Patitas"
                className="text-stone-400 transition hover:text-white"
              >
                Reportar un problema
              </a>
            </li>
            <li>
              <Link to="/privacidad" className="text-stone-400 transition hover:text-white">
                Política de Privacidad
              </Link>
            </li>
            <li>
              <a
                href={waLink(DONATE_WHATSAPP, '¡Hola! Te escribo desde Patitas.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-stone-400 transition hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-stone-500 sm:flex-row sm:px-6">
          <span>© 2026 Patitas</span>
          <span>La historia clínica de tus pacientes en un QR</span>
          <span>Hecha por Facundo Dicroce</span>
        </div>
      </div>
    </footer>
  );
}
