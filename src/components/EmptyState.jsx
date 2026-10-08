import { PawMark } from './Logo';

export default function EmptyState({ title, text, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center animate-fade-in">
      <PawMark className="h-24 w-24 opacity-20" />
      <h3 className="mt-6 text-lg font-extrabold text-stone-900">{title}</h3>
      {text && <p className="mt-2 max-w-sm text-sm text-stone-500">{text}</p>}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-full bg-accent px-6 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark shadow-pop"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
