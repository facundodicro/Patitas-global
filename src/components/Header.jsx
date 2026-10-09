import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ChevronDown, Download, LogOut, Menu, Settings, User, X } from 'lucide-react';
import Logo from './Logo';
import InstallModal from './InstallModal';
import { useAuth } from '../hooks/useAuth';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/tablon', label: 'Tablón', end: false },
  { to: '/#como-funciona', label: 'Cómo funciona', end: false },
  { to: '/perfil', label: 'Mi perfil', end: false },
];

function navClass({ isActive }) {
  return `text-sm transition ${isActive ? 'text-brand font-bold' : 'text-stone-600 hover:text-brand font-medium'}`;
}

export default function Header() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo animated />

          <nav className="hidden md:flex items-center gap-6">
            {LINKS.map((l) => (
              <NavLink key={l.to + l.label} to={l.to} end={l.end} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setInstallOpen(true)}
              title="Instalar la app"
              aria-label="Instalar la app"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-brand"
            >
              <Download className="h-5 w-5" />
            </button>

            {user ? (
              <div className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-stone-200 py-1.5 pl-1.5 pr-3 text-sm font-semibold text-stone-700 transition hover:border-brand hover:text-brand"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <User className="h-4 w-4" />
                  </span>
                  <span className="max-w-[140px] truncate">{user.email}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl bg-white shadow-pop animate-fade-in">
                    <p className="truncate border-b border-stone-100 px-4 py-3 text-xs text-stone-500">
                      {user.email}
                    </p>
                    <Link
                      to="/perfil"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                    >
                      <User className="h-4 w-4" /> Mi perfil
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 transition hover:bg-stone-50"
                      >
                        <Settings className="h-4 w-4" /> Administración
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-status-perdido transition hover:bg-stone-50"
                    >
                      <LogOut className="h-4 w-4" /> Salir
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/ingresar"
                className="hidden md:inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-light"
              >
                Ingresar
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 transition hover:bg-stone-100 md:hidden"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-stone-200 bg-white px-4 py-4 md:hidden animate-fade-in">
            <div className="flex flex-col gap-1">
              {LINKS.map((l) => (
                <NavLink
                  key={l.to + l.label}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMenuOpen(false)}
                  className={navClass}
                >
                  <span className="block rounded-xl px-3 py-2.5">{l.label}</span>
                </NavLink>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600"
                    >
                      Administración
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      handleSignOut();
                    }}
                    className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-status-perdido"
                  >
                    Salir ({user.email})
                  </button>
                </>
              ) : (
                <Link
                  to="/ingresar"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 rounded-full bg-brand px-5 py-2.5 text-center text-sm font-bold text-white"
                >
                  Ingresar
                </Link>
              )}
            </div>
          </nav>
        )}
      </header>

      <InstallModal open={installOpen} onClose={() => setInstallOpen(false)} />
    </>
  );
}
