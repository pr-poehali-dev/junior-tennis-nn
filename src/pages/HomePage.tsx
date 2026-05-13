import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, PLAYERS, PLATFORM_STATS, GALLERY_PHOTOS } from '@/data/mockData';

const statusLabel = (status: string) => {
  if (status === 'registration') return { label: 'Регистрация открыта', cls: 'bg-tennis-yellow text-tennis-green-dark' };
  if (status === 'upcoming') return { label: 'Скоро', cls: 'bg-blue-100 text-blue-700' };
  if (status === 'completed') return { label: 'Завершён', cls: 'bg-gray-100 text-gray-500' };
  return { label: status, cls: 'bg-gray-100 text-gray-500' };
};

export default function HomePage() {
  const upcoming = TOURNAMENTS.filter(t => t.status !== 'completed').slice(0, 3);
  const top5 = PLAYERS.slice(0, 5);

  const stats = [
    { value: PLATFORM_STATS.players, label: 'Игроков' },
    { value: PLATFORM_STATS.tournaments, label: 'Турниров' },
    { value: PLATFORM_STATS.cities, label: 'Городов' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.15) 39px, rgba(255,255,255,0.15) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.15) 39px, rgba(255,255,255,0.15) 40px)'
          }}
        />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-tennis-yellow/20 border border-tennis-yellow/40 text-tennis-yellow text-sm font-semibold px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              <Icon name="Zap" size={14} />
              Сезон 2026 · Нижний Новгород и область
            </div>
            <h1 className="font-oswald text-5xl md:text-6xl font-bold text-white leading-tight mb-4 animate-slide-up">
              ДЕТСКИЙ<br />
              <span className="text-tennis-yellow">ТЕННИСНЫЙ</span><br />
              ТУР
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Любительский тур для детей 10–16 лет Нижнего Новгорода и области. Турниры, рейтинг, медали.
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Link
                to="/calendar"
                className="inline-flex items-center gap-2 bg-tennis-yellow text-tennis-green-dark font-bold px-6 py-3 rounded-xl hover:bg-tennis-yellow-light transition-all yellow-glow"
              >
                <Icon name="CalendarDays" size={18} />
                Календарь турниров
              </Link>
              <Link
                to="/rating"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/20 transition-all"
              >
                <Icon name="Trophy" size={18} />
                Рейтинг игроков
              </Link>
            </div>
          </div>

          {/* Stats — реальные цифры, обновляются каждые 4 часа */}
          <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center border border-white/10">
                <div className="font-oswald text-3xl font-bold text-tennis-yellow">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Галерея-лента последних фото */}
      {GALLERY_PHOTOS.length > 0 && (
        <section className="bg-tennis-green-dark py-8 overflow-hidden">
          <div className="container mx-auto px-4 mb-4 flex items-center justify-between">
            <h2 className="font-oswald text-xl font-bold text-white flex items-center gap-2">
              <Icon name="Camera" size={20} />
              Фото с турниров
            </h2>
            <Link to="/gallery" className="text-tennis-yellow text-sm font-semibold hover:underline flex items-center gap-1">
              Вся галерея <Icon name="ChevronRight" size={16} />
            </Link>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {GALLERY_PHOTOS.map((photo) => (
              <Link
                key={photo.id}
                to="/gallery"
                className="shrink-0 group relative overflow-hidden rounded-xl"
                style={{ width: 200, height: 140 }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  <div className="text-white text-xs font-semibold leading-tight">{photo.caption}</div>
                  <div className="text-white/60 text-xs">{photo.tournamentName}</div>
                </div>
              </Link>
            ))}
            <Link
              to="/gallery"
              className="shrink-0 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 text-white/50 hover:text-white hover:border-white/50 transition-all"
              style={{ width: 140, height: 140 }}
            >
              <Icon name="ImagePlus" size={24} />
              <span className="text-xs font-medium">Все фото</span>
            </Link>
          </div>
        </section>
      )}

      {/* Ближайшие турниры */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-oswald text-2xl font-bold text-tennis-green flex items-center gap-2">
            <Icon name="CalendarDays" size={22} />
            Ближайшие турниры
          </h2>
          <Link to="/calendar" className="text-tennis-green font-semibold text-sm hover:underline flex items-center gap-1">
            Все турниры <Icon name="ChevronRight" size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {upcoming.map((t) => {
            const st = statusLabel(t.status);
            const fill = Math.round((t.currentPlayers / t.maxPlayers) * 100);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm card-hover overflow-hidden">
                <div className="h-2 bg-tennis-green" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                    <span className="text-xs text-muted-foreground">{t.venueType === 'indoor' ? '🏛️ Крытый' : '☀️ Открытый'}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{t.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                    <Icon name="MapPin" size={14} />
                    {t.city}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <Icon name="Calendar" size={14} />
                    {new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} – {new Date(t.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Участники</span>
                      <span className="font-semibold text-tennis-green">{t.currentPlayers}/{t.maxPlayers}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className="h-full bg-tennis-green rounded-full transition-all" style={{ width: `${fill}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <span className="text-xs bg-muted px-2 py-1 rounded font-medium">{t.ageGroup} лет</span>
                      <span className="text-xs bg-muted px-2 py-1 rounded font-medium">
                        {t.format === 'singles' ? 'Одиночный' : t.format === 'doubles' ? 'Парный' : 'Микст'}
                      </span>
                    </div>
                    <Link to={`/tournament/${t.id}`} className="text-sm font-bold text-tennis-green hover:underline">
                      Подробнее →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Топ рейтинг */}
      <section className="bg-muted/40 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-oswald text-2xl font-bold text-tennis-green flex items-center gap-2">
              <Icon name="Trophy" size={22} />
              Топ рейтинга
            </h2>
            <Link to="/rating" className="text-tennis-green font-semibold text-sm hover:underline flex items-center gap-1">
              Полный рейтинг <Icon name="ChevronRight" size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
            {top5.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Icon name="Users" size={32} className="mx-auto mb-3 opacity-30" />
                <div className="text-sm">Игроки ещё не зарегистрированы</div>
              </div>
            ) : top5.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-oswald font-bold text-sm shrink-0 ${
                  i === 0 ? 'bg-tennis-yellow text-tennis-green-dark' :
                  i === 1 ? 'bg-gray-200 text-gray-700' :
                  i === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {p.rank}
                </div>
                <div className="w-9 h-9 rounded-full bg-tennis-green/10 flex items-center justify-center shrink-0 text-lg">
                  {p.emoji || '🎾'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.firstName} {p.lastName}</div>
                  <div className="text-xs text-muted-foreground">«{p.nickname}» · {p.city}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-oswald font-bold text-lg text-tennis-green">{p.rating}</div>
                  <div className="text-xs text-muted-foreground">очков</div>
                </div>
                <div className="shrink-0">
                  {p.rankChange > 0 ? <span className="text-green-500 text-xs font-bold flex items-center gap-0.5"><Icon name="TrendingUp" size={12} />+{p.rankChange}</span> :
                   p.rankChange < 0 ? <span className="text-red-400 text-xs font-bold flex items-center gap-0.5"><Icon name="TrendingDown" size={12} />{p.rankChange}</span> :
                   <span className="text-muted-foreground text-xs">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как участвовать */}
      <section className="container mx-auto px-4 py-14">
        <h2 className="font-oswald text-2xl font-bold text-center text-tennis-green mb-10">Как участвовать</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: 'UserPlus', step: '01', title: 'Регистрация', desc: 'Создайте профиль игрока с ФИ, городом и тренером' },
            { icon: 'CalendarCheck', step: '02', title: 'Запись на турнир', desc: 'Выберите подходящий турнир по возрасту и городу' },
            { icon: 'Swords', step: '03', title: 'Играйте', desc: 'Участвуйте в группах и плей-офф по сетке' },
            { icon: 'Award', step: '04', title: 'Очки и рейтинг', desc: 'Получайте очки, поднимайтесь в рейтинге области' },
          ].map((item) => (
            <div key={item.step} className="text-center group">
              <div className="w-16 h-16 bg-tennis-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-tennis-green/20 transition-colors">
                <Icon name={item.icon} size={28} className="text-tennis-green" />
              </div>
              <div className="font-oswald text-tennis-yellow text-sm font-bold mb-1">{item.step}</div>
              <div className="font-bold text-base mb-2">{item.title}</div>
              <div className="text-sm text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
