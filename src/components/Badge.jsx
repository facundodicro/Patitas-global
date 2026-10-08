const STYLES = {
  perdida: {
    label: 'Perdida',
    pill: 'bg-status-perdido/10 text-status-perdido',
    dot: 'bg-status-perdido',
  },
  encontrada: {
    label: 'Encontrada',
    pill: 'bg-status-encontrado/10 text-status-encontrado',
    dot: 'bg-status-encontrado',
  },
  en_casa: {
    label: 'En casa',
    pill: 'bg-stone-500/10 text-stone-600',
    dot: 'bg-stone-500',
  },
};

export default function Badge({ estado }) {
  const style = STYLES[estado] || STYLES.perdida;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${style.pill}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
