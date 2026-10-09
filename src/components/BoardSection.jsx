import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import PetCard from './PetCard';
import EmptyState from './EmptyState';

const CHIPS = [
  { key: 'todas', label: 'Todas' },
  { key: 'perdida', label: 'Perdidas' },
  { key: 'encontrada', label: 'Encontradas' },
  { key: 'Perro', label: 'Perros' },
  { key: 'Gato', label: 'Gatos' },
];

function matches(report, query, chip) {
  if (chip === 'perdida' || chip === 'encontrada' || chip === 'en_casa') {
    if (report.estado !== chip) return false;
  } else if (chip === 'Perro' || chip === 'Gato' || chip === 'Otro') {
    if (report.especie !== chip) return false;
  }

  const q = query.trim().toLowerCase();
  if (q) {
    const haystack = [report.nombre, report.raza, report.zona, report.telefono]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(q)) return false;
  }
  return true;
}

export default function BoardSection({
  reports,
  loading,
  onLocate,
  user,
  isAdmin,
  onMarkReunited,
  onDeleteReport,
}) {
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('todas');

  const filtered = useMemo(
    () => (reports || []).filter((r) => matches(r, query, chip)),
    [reports, query, chip]
  );

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá por nombre, raza, zona o teléfono"
          className="w-full rounded-full border border-stone-200 bg-white py-3 pl-12 pr-4 text-sm text-stone-900 shadow-card outline-none transition placeholder:text-stone-400 focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map((c) => {
          const active = chip === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setChip(c.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                active
                  ? 'bg-brand text-white shadow-card'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-brand hover:text-brand'
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-2xl bg-white shadow-card">
                <div className="h-44 bg-stone-200" />
                <div className="space-y-3 p-4">
                  <div className="h-5 w-2/3 rounded bg-stone-200" />
                  <div className="h-4 w-1/2 rounded bg-stone-200" />
                  <div className="h-4 w-3/4 rounded bg-stone-200" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No encontramos mascotas"
            text="Probá con otra búsqueda o publicá un reporte."
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((report) => (
              <PetCard
                key={report.id}
                report={report}
                onLocate={onLocate}
                user={user}
                isAdmin={isAdmin}
                onMarkReunited={onMarkReunited}
                onDeleteReport={onDeleteReport}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
