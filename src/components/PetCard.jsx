import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Gift, Map, MapPin, MessageCircle, Phone } from 'lucide-react';
import Badge from './Badge';
import PetPhoto from './PetPhoto';
import { waLink, toWhatsAppNumber } from '../lib/qr';

function formatFecha(fecha) {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function PetCard({ report, onLocate }) {
  const [open, setOpen] = useState(false);
  const {
    nombre,
    especie,
    raza,
    senas,
    recompensa,
    zona,
    fecha,
    telefono,
    foto_url,
    estado,
  } = report;

  const whatsappText = `¡Hola! Vi tu publicación de ${nombre} en Patitas y creo que puedo ayudarte.`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-card animate-fade-up">
      <PetPhoto src={foto_url} alt={`Foto de ${nombre}`} className="h-44 w-full" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-extrabold text-stone-900">{nombre}</h3>
          <Badge estado={estado} />
        </div>

        <p className="mt-1 text-sm text-stone-500">
          {especie}{raza ? ` · ${raza}` : ''}
        </p>

        <div className="mt-3 space-y-1.5 text-sm text-stone-600">
          {zona && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-brand" /> {zona}
            </p>
          )}
          {fecha && (
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-brand" /> {formatFecha(fecha)}
            </p>
          )}
          {recompensa && (
            <p className="flex items-center gap-2 font-semibold text-amber-600">
              <Gift className="h-4 w-4 shrink-0" /> Recompensa: {recompensa}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand transition hover:text-brand-light"
        >
          {open ? 'Ver menos' : 'Ver más'}
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {open && (
          <div className="mt-3 space-y-3 animate-fade-in">
            {senas && (
              <p className="text-sm leading-relaxed text-stone-600">
                <span className="font-bold text-stone-900">Señas particulares: </span>
                {senas}
              </p>
            )}
            {telefono && (
              <p className="flex items-center gap-2 text-sm text-stone-600">
                <Phone className="h-4 w-4 shrink-0 text-brand" />
                <span className="font-semibold">{telefono}</span>
              </p>
            )}
            <div className="flex flex-col gap-2">
              {onLocate && (
                <button
                  type="button"
                  onClick={() => onLocate(report)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white"
                >
                  <Map className="h-4 w-4" /> Ver en mapa
                </button>
              )}
              {telefono && (
                <a
                  href={waLink(telefono, whatsappText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-bold text-white transition hover:brightness-95"
                >
                  <MessageCircle className="h-4 w-4" /> Escribime por WhatsApp
                </a>
              )}
              {telefono && (
                <a
                  href={`tel:${toWhatsAppNumber(telefono)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 transition hover:border-stone-400"
                >
                  <Phone className="h-4 w-4" /> Llamar
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
