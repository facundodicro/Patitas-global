import { Check, MessageCircle } from 'lucide-react';
import Logo from './Logo';
import DonateButton from './DonateButton';
import { waLink } from '../lib/qr';
import { DONATE_WHATSAPP } from '../lib/config';

const TIPS = [
  'Publicá rápido: cuanto antes avisás, más chances de reencuentro.',
  'Sumá una foto clara y las señas particulares de tu mascota.',
  'Recorré la zona en horarios tranquilos y dejá tu contacto visible.',
  'Pediles a vecinos y comercios que compartan la publicación.',
];

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Logo variant="light" />
          <p className="mt-4 text-sm leading-relaxed text-stone-400">
            Patitas conecta a quienes perdieron o encontraron una mascota en cualquier lugar,
            para que cada peludo vuelva a casa lo antes posible.
          </p>
          <div className="mt-4">
            <DonateButton label="Donar" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wide text-white">
            Consejos de búsqueda
          </h3>
          <ul className="mt-4 space-y-3">
            {TIPS.map((tip) => (
              <li key={tip} className="flex items-start gap-2.5 text-sm text-stone-400">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" />
                {tip}
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
          <span>Hecho con amor para proteger a cada peludo</span>
        </div>
      </div>
    </footer>
  );
}
