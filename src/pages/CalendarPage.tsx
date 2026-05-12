import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'registration', label: 'Регистрация' },
  { value: 'upcoming', label: 'Скоро' },
  { value: 'completed', label: 'Завершён' },
];
const VENUE_OPTIONS = [
  { value: 'all', label: 'Все площадки' },
  { value: 'outdoor', label: '☀️ Открытые' },
  { value: 'indoor', label: '🏛️ Крытые' },
];
const AGE_OPTIONS = [
  { value: 'all', label: 'Все возрасты' },
  { value: '10-12', label: '10–12 лет' },
  { value: '10-14', label: '10–14 лет' },
  { value: '12-16', label: '12–16 лет' },
  { value: '10-16', label: '10–16 лет' },
];
const CITIES = ['all', 'Нижний Новгород', 'Дзержинск', 'Бор'];

const statusMeta = (status: string) => {
  if (status === 'registration') return { label: 'Регистрация', cls: 'bg-tennis-yellow text-tennis-green-dark' };
  if (status === 'upcoming') return { label: 'Скоро', cls: 'bg-blue-100 text-blue-700' };
  if (status === 'completed') return { label: 'Завершён', cls: 'bg-gray-100 text-gray-500' };
  return { label: status, cls: 'bg-gray-100 text-gray-500' };
};

export default function CalendarPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVenue, setFilterVenue] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [registerModal, setRegisterModal] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [registered, setRegistered] = useState<number[]>([]);

  const filtered = TOURNAMENTS.filter(t => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterVenue !== 'all' && t.venueType !== filterVenue) return false;
    if (filterAge !== 'all' && t.ageGroup !== filterAge) return false;
    if (filterCity !== 'all' && t.city !== filterCity) return false;
    return true;
  });

  const handleRegister = () => {
    if (registerModal) {
      setRegistered(prev => [...prev, registerModal.id]);
      setRegisterModal(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-oswald text-3xl font-bold text-tennis-green mb-1">Календарь турниров</h1>
        <p className="text-muted-foreground">Сезон 2026 · Нижний Новгород и область</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Icon name="MapPin" size={16} className="text-muted-foreground" />
            <select
              value={filterCity}
              onChange={e => setFilterCity(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
            >
              {CITIES.map(c => <option key={c} value={c}>{c === 'all' ? 'Все города' : c}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="Users" size={16} className="text-muted-foreground" />
            <select
              value={filterAge}
              onChange={e => setFilterAge(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
            >
              {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex flex-wrap gap-1.5 ml-auto">
            {STATUS_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setFilterStatus(o.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterStatus === o.value
                    ? 'bg-tennis-green text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {VENUE_OPTIONS.map(o => (
              <button
                key={o.value}
                onClick={() => setFilterVenue(o.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filterVenue === o.value
                    ? 'bg-tennis-green text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Icon name="SearchX" size={40} className="mx-auto mb-3 opacity-40" />
          <div>Турниры не найдены. Измените фильтры.</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((t) => {
            const st = statusMeta(t.status);
            const fill = Math.round((t.currentPlayers / t.maxPlayers) * 100);
            const isRegistered = registered.includes(t.id);
            const canRegister = t.status === 'registration' && t.currentPlayers < t.maxPlayers;

            return (
              <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden card-hover">
                <div className="h-1.5 bg-gradient-to-r from-tennis-green to-tennis-green-light" />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>{t.venueType === 'indoor' ? '🏛️ Крытый' : '☀️ Открытый'}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg text-foreground mb-2">{t.name}</h3>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} className="shrink-0" />
                      <span>{t.city} · {t.venueName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Navigation" size={14} className="shrink-0" />
                      <span>{t.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} className="shrink-0" />
                      <span>
                        {new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} – {new Date(t.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} className="shrink-0" />
                      <span>Запись до: {new Date(t.registrationDeadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">{t.ageGroup} лет</span>
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">{t.category}</span>
                  </div>

                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Участники</span>
                      <span className="font-semibold text-tennis-green">{t.currentPlayers} / {t.maxPlayers}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div
                        className={`h-full rounded-full transition-all ${fill >= 90 ? 'bg-orange-400' : 'bg-tennis-green'}`}
                        style={{ width: `${fill}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to={`/tournament/${t.id}`}
                      className="flex-1 text-center py-2.5 rounded-xl border border-tennis-green text-tennis-green font-semibold text-sm hover:bg-tennis-green/5 transition-colors"
                    >
                      Подробнее
                    </Link>
                    {isRegistered ? (
                      <div className="flex-1 text-center py-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-sm flex items-center justify-center gap-1">
                        <Icon name="CheckCircle" size={15} />
                        Записан
                      </div>
                    ) : canRegister ? (
                      <button
                        onClick={() => setRegisterModal(t)}
                        className="flex-1 py-2.5 rounded-xl bg-tennis-green text-white font-bold text-sm hover:bg-tennis-green-light transition-colors"
                      >
                        Записаться
                      </button>
                    ) : (
                      <div className="flex-1 text-center py-2.5 rounded-xl bg-muted text-muted-foreground font-semibold text-sm cursor-not-allowed">
                        {t.status === 'completed' ? 'Завершён' : 'Мест нет'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Register modal */}
      <Dialog open={!!registerModal} onOpenChange={() => setRegisterModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-tennis-green">Подтверждение записи</DialogTitle>
          </DialogHeader>
          {registerModal && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4">
                <div className="font-bold text-base mb-2">{registerModal.name}</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2"><Icon name="MapPin" size={14} />{registerModal.city} · {registerModal.venueName}</div>
                  <div className="flex items-center gap-2"><Icon name="Calendar" size={14} />{new Date(registerModal.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} – {new Date(registerModal.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Вы подтверждаете участие в турнире? Отказаться от участия можно не позднее чем за 48 часов до начала.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setRegisterModal(null)} className="flex-1">Отмена</Button>
                <Button onClick={handleRegister} className="flex-1 bg-tennis-green hover:bg-tennis-green-light text-white">
                  Записаться
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
