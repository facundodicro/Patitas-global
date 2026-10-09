import { useState } from 'react';
import { Calendar, Check, ChevronDown, ChevronUp, Gift, Home, Map, MapPin, MessageCircle, Pencil, Phone, Trash2 } from 'lucide-react';
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

export default function PetCard({ report, onLocate, user, isAdmin, onMarkReunited, onDeleteReport, onEditReport }) {
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');
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
    reporter_id,
  } = report;

  const whatsappText = `¡Hola! Vi tu publicación de ${nombre} en Patitas y creo que puedo ayudarte.`;

  // Solo el dueño de la publicación (o un admin) puede gestionarla
  const isOwner = user && reporter_id && reporter_id === user.id
  const canManage = isAdmin || isOwner

  async function handleReunited() {
    if (!onMarkReunited || busy) return;
    setBusy(true);
    setActionError('');
    try {
      await onMarkReunited(report);
    } catch {
      setActionError('No se pudo actualizar. Probá de nuevo.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!onDeleteReport || busy) return;
    setBusy(true);
    setActionError('');
    try {
      await onDeleteReport(report.id);
    } catch {
      setActionError('No se pudo eliminar. Probá de nuevo.');
      setBusy(false);
    }
  }

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

            {canManage && (
              <div className="border-t border-stone-100 pt-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-stone-400">
                  {isOwner ? 'Tu publicación' : 'Moderar publicación'}
                </p>
                {actionError && (
                  <p className="mb-2 text-xs font-semibold text-red-600">{actionError}</p>
                )}
                {!confirmDelete ? (
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => onEditReport?.(report)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-4 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-white disabled:opacity-60"
                    >
                      <Pencil className="h-4 w-4" /> Editar publicación
                    </button>
                    {estado !== 'en_casa' && (
                      <button
                        type="button"
                        onClick={handleReunited}
                        disabled={busy}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-60"
                      >
                        <Home className="h-4 w-4" />
                        {busy ? 'Guardando…' : 'Ya está en casa 🏠'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(true)}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-200 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar publicación
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-sm font-semibold text-stone-800">
                      ¿Eliminar esta publicación? No se puede deshacer.
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={busy}
                        className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
                      >
                        <Check className="h-4 w-4" /> {busy ? 'Eliminando…' : 'Sí, eliminar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={busy}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-bold text-stone-600 transition hover:border-stone-400"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
