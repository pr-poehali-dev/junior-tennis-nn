import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { SITE_CONTACTS } from '@/data/mockData';
import { getSession } from '@/data/authStore';

const NAV_ITEMS = [
  { path: '/', label: 'Главная', icon: 'Home' },
  { path: '/gallery', label: 'Галерея', icon: 'Camera' },
  { path: '/calendar', label: 'Календарь', icon: 'CalendarDays' },
  { path: '/rating', label: 'Рейтинг', icon: 'Trophy' },
  { path: '/profile', label: 'Профиль', icon: 'User' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const session = getSession();

  const profileIcon = session ? session.emoji : undefined;

  return (
    <div className="min-h-screen bg-background font-montserrat">
      <header className="sticky top-0 z-50 bg-tennis-green shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-tennis-yellow rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <span className="text-lg">🎾</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-oswald font-bold text-white text-lg leading-tight tracking-wide">ЛДТТНН</div>
                <div className="text-white/60 text-xs leading-tight">Н. Новгород</div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-150 ${
                    location.pathname === item.path
                      ? 'bg-tennis-yellow text-tennis-green-dark font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  {item.path === '/profile' && profileIcon
                    ? <span className="text-base">{profileIcon}</span>
                    : <Icon name={item.icon} size={16} />}
                  {item.label}
                </Link>
              ))}
            </nav>

            <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-tennis-green-dark border-t border-white/10 animate-fade-in">
            <div className="container mx-auto px-4 py-2">
              {NAV_ITEMS.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm mb-1 transition-all ${
                    location.pathname === item.path
                      ? 'bg-tennis-yellow text-tennis-green-dark font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}>
                  {item.path === '/profile' && profileIcon
                    ? <span className="text-base">{profileIcon}</span>
                    : <Icon name={item.icon} size={18} />}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-tennis-green-dark text-white/60 py-10 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-tennis-yellow font-oswald font-bold text-xl">ЛДТТНН</span>
              </div>
              <p className="text-sm text-white/50 max-w-sm leading-relaxed">
                Любительский Детский Теннисный Тур Нижнего Новгорода и области. Возраст участников: 10–16 лет.
              </p>
            </div>

            {/* Contacts — редактируется через админку */}
            {(SITE_CONTACTS.phone || SITE_CONTACTS.email || SITE_CONTACTS.vk || SITE_CONTACTS.telegram || SITE_CONTACTS.address) ? (
              <div className="space-y-2">
                <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Контакты</div>
                {SITE_CONTACTS.phone && (
                  <a href={`tel:${SITE_CONTACTS.phone}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                    <Icon name="Phone" size={14} />{SITE_CONTACTS.phone}
                  </a>
                )}
                {SITE_CONTACTS.email && (
                  <a href={`mailto:${SITE_CONTACTS.email}`} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                    <Icon name="Mail" size={14} />{SITE_CONTACTS.email}
                  </a>
                )}
                {SITE_CONTACTS.telegram && (
                  <a href={SITE_CONTACTS.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                    <Icon name="Send" size={14} />Telegram
                  </a>
                )}
                {SITE_CONTACTS.vk && (
                  <a href={SITE_CONTACTS.vk} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                    <Icon name="Users" size={14} />ВКонтакте
                  </a>
                )}
                {SITE_CONTACTS.address && (
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="MapPin" size={14} />{SITE_CONTACTS.address}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-white/30 italic">Контактная информация будет добавлена администратором</div>
            )}

            <div className="space-y-2">
              <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Разделы</div>
              {NAV_ITEMS.map(item => (
                <Link key={item.path} to={item.path} className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Icon name={item.icon} size={13} />{item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs text-white/30">© 2026 ЛДТТНН · Нижегородская область</div>
            <Link to="/auth" className="text-xs text-white/30 hover:text-white/60 transition-colors flex items-center gap-1">
              <Icon name="LogIn" size={12} />
              Сменить профиль
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
