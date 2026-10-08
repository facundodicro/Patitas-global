import { PawMark } from './Logo';

export default function PetPhoto({ src, alt, className }) {
  if (src) {
    return (
      <div className={className}>
        <img src={src} alt={alt || 'Foto de la mascota'} className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${className} flex items-center justify-center bg-brand-faint`}>
      <PawMark className="h-16 w-16 opacity-30" />
    </div>
  );
}
