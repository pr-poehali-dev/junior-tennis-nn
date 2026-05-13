import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, NNO_CITIES } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const STATUS_OPTIONS = [
  { value: 'all', label: 'Все' },
  { value: 'registration', label: 'Запись' },
  { value: 'upcoming', label: 'Скоро' },
  { value: 'completed', label: 'Завершён' },
];
const VENUE_OPTIONS = [
  { value: 'all', label: 'Все' },
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
const GENDER_OPTIONS = [
  { value: 'all', label: 'Любой' },
  { value: 'male', label: '♂ Мужской' },
  { value: 'female', label: '♀ Женский' },
  { value: 'mixed', label: '⚡ Микст' },
];
const FORMAT_OPTIONS = [
  { value: 'all', label: 'Все форматы' },
  { value: 'singles', label: '🎾 Одиночный' },
  { value: 'doubles', label: '👥 Парный' },
  { value: 'mixed_doubles', label: '⚡ Микст-пары' },
];
const MONTHS = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',
];

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
  const [filterGender, setFilterGender] = useState('all');
  const [filterFormat, setFilterFormat] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterWeek, setFilterWeek] = useState('all');
  const [registerModal, setRegisterModal] = useState<typeof TOURNAMENTS[0] | null>(null);
  const [registered, setRegistered] = useState<number[]>([]);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const weekOptions = useMemo(() => {
    const opts: { value: string; label: string; start: Date; end: Date }[] = [];
    const now = new Date();
    for (let w = 0; w < 12; w++) {
      const start = new Date(now);
      start.setDate(now.getDate() + w * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      opts.push({
        value: `week-${w}`,
        label: `${start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}`,
        start, end,
      });
    }
    return opts;
  }, []);

  const filtered = useMemo(() => TOURNAMENTS.filter(t => {
    if (t.status === 'pending_approval') return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterVenue !== 'all' && t.venueType !== filterVenue) return false;
    if (filterAge !== 'all' && t.ageGroup !== filterAge) return false;
    if (filterCity !== 'all' && t.city !== filterCity) return false;
    if (filterFormat !== 'all' && t.format !== filterFormat) return false;
    if (filterGender !== 'all') {
      if (filterGender === 'mixed' && t.genderRestriction !== null) return false;
      if (filterGender === 'male' && t.genderRestriction !== 'male') return false;
      if (filterGender === 'female' && t.genderRestriction !== 'female') return false;
    }
    if (filterMonth !== 'all') {
      const month = new Date(t.dateStart).getMonth();
      if (String(month) !== filterMonth) return false;
    }
    if (filterWeek !== 'all') {
      const week = weekOptions.find(w => w.value === filterWeek);
      if (week) {
        const tStart = new Date(t.dateStart);
        if (tStart < week.start || tStart > week.end) return false;
      }
    }
    return true;
  }), [filterStatus, filterVenue, filterAge, filterCity, filterGender, filterFormat, filterMonth, filterWeek, weekOptions]);

  const handleRegister = () => {
    if (registerModal) {
      setRegistered(prev => [...prev, registerModal.id]);
      setRegisterModal(null);
    }
  };

  const resetFilters = () => {
    setFilterStatus('all'); setFilterVenue('all'); setFilterAge('all');
    setFilterCity('all'); setFilterGender('all'); setFilterFormat('all');
    setFilterMonth('all'); setFilterWeek('all');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-oswald text-3xl font-bold text-tennis-green mb-1">Календарь турниров</h1>
        <p className="text-muted-foreground">Сезон 2026 · Нижегородская область</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border p-4 mb-6 shadow-sm">
        <div className="flex flex-wrap gap-3 mb-3">
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
            <option value="all">Все города НО</option>
            {NNO_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterAge} onChange={e => setFilterAge(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
            {AGE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map(o => (
              <button key={o.value} onClick={() => setFilterStatus(o.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterStatus === o.value ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {o.label}
              </button>
            ))}
          </div>
          <button onClick={() => setFiltersExpanded(!filtersExpanded)}
            className="ml-auto flex items-center gap-1.5 text-sm text-tennis-green font-medium">
            <Icon name={filtersExpanded ? 'ChevronUp' : 'SlidersHorizontal'} size={15} />
            {filtersExpanded ? 'Скрыть' : 'Ещё фильтры'}
          </button>
        </div>

        {filtersExpanded && (
          <div className="flex flex-wrap gap-3 pt-3 border-t border-border">
            <div className="flex gap-1">
              {VENUE_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setFilterVenue(o.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filterVenue === o.value ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                  {o.label}
                </button>
              ))}
            </div>
            <select value={filterGender} onChange={e => setFilterGender(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
              {GENDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filterFormat} onChange={e => setFilterFormat(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
              {FORMAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={filterMonth} onChange={e => { setFilterMonth(e.target.value); setFilterWeek('all'); }}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
              <option value="all">Все месяцы</option>
              {MONTHS.map((m, i) => <option key={i} value={String(i)}>{m}</option>)}
            </select>
            <select value={filterWeek} onChange={e => { setFilterWeek(e.target.value); setFilterMonth('all'); }}
              className="text-sm border border-border rounded-lg px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
              <option value="all">Все недели</option>
              {weekOptions.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
            </select>
            <button onClick={resetFilters} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Icon name="X" size={14} /> Сбросить
            </button>
          </div>
        )}
      </div>

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
                    <span className="text-xs text-muted-foreground">{t.venueType === 'indoor' ? '🏛️ Крытый' : '☀️ Открытый'}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{t.name}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} className="shrink-0" />
                      {t.city} · {t.venueName}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Calendar" size={14} className="shrink-0" />
                      {new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} – {new Date(t.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Clock" size={14} className="shrink-0" />
                      Запись до: {new Date(t.registrationDeadline).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">{t.ageGroup} лет</span>
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">{t.category}</span>
                    <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
                      {t.format === 'singles' ? '🎾 Одиночный' : t.format === 'doubles' ? '👥 Парный' : '⚡ Микст'}
                    </span>
                    {t.genderRestriction && (
                      <span className="text-xs bg-muted px-2.5 py-1 rounded-full font-medium">
                        {t.genderRestriction === 'male' ? '♂ Муж.' : '♀ Жен.'}
                      </span>
                    )}
                  </div>
                  <div className="mb-5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Участники</span>
                      <span className="font-semibold text-tennis-green">{t.currentPlayers} / {t.maxPlayers}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full">
                      <div className={`h-full rounded-full ${fill >= 90 ? 'bg-orange-400' : 'bg-tennis-green'}`} style={{ width: `${fill}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link to={`/tournament/${t.id}`} className="flex-1 text-center py-2.5 rounded-xl border border-tennis-green text-tennis-green font-semibold text-sm hover:bg-tennis-green/5 transition-colors">
                      Подробнее
                    </Link>
                    {isRegistered ? (
                      <div className="flex-1 text-center py-2.5 rounded-xl bg-green-50 text-green-700 font-semibold text-sm flex items-center justify-center gap-1">
                        <Icon name="CheckCircle" size={15} /> Записан
                      </div>
                    ) : canRegister ? (
                      <button onClick={() => setRegisterModal(t)} className="flex-1 py-2.5 rounded-xl bg-tennis-green text-white font-bold text-sm hover:bg-tennis-green-light transition-colors">
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
              <p className="text-sm text-muted-foreground">Отказ возможен не позднее чем за 48 часов до начала.</p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setRegisterModal(null)} className="flex-1">Отмена</Button>
                <Button onClick={handleRegister} className="flex-1 bg-tennis-green hover:bg-tennis-green-light text-white">Записаться</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
