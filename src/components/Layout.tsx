import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV_ITEMS = [
  { path: '/', label: 'Главная', icon: 'Home' },
  { path: '/calendar', label: 'Календарь', icon: 'CalendarDays' },
  { path: '/rating', label: 'Рейтинг', icon: 'Trophy' },
  { path: '/profile', label: 'Профиль', icon: 'User' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <header className="sticky top-0 z-50 bg-tennis-green shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-tennis-yellow rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-tennis-green-dark font-oswald font-bold text-lg">🎾</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-oswald font-bold text-white text-lg leading-tight tracking-wide">ЛДТТНН</div>
                <div className="text-white/60 text-xs leading-tight">Н. Новгород</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                    location.pathname === item.path
                      ? 'bg-tennis-yellow text-tennis-green-dark font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg text-sm transition-all"
              >
                <Icon name="Bell" size={16} />
              </Link>

              <button
                className="md:hidden text-white p-2"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-tennis-green-dark border-t border-white/10 animate-fade-in">
            <div className="container mx-auto px-4 py-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm mb-1 transition-all ${
                    location.pathname === item.path
                      ? 'bg-tennis-yellow text-tennis-green-dark font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-tennis-green-dark text-white/60 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-tennis-yellow font-oswald font-bold text-lg">ЛДТТНН</span>
              <span className="text-white/40">|</span>
              <span className="text-sm">Любительский Детский Теннисный Тур Нижнего Новгорода</span>
            </div>
            <div className="text-sm">© 2026 · Возраст 10–16 лет · г. Нижний Новгород</div>
          </div>
        </div>
      </footer>
    </div>
  );
}