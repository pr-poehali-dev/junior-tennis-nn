import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, VENUES, PLAYERS } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type AdminTab = 'tournaments' | 'venues' | 'players';

const statusMeta = (status: string) => {
  if (status === 'registration') return { label: 'Регистрация', cls: 'bg-tennis-yellow text-tennis-green-dark' };
  if (status === 'upcoming') return { label: 'Скоро', cls: 'bg-blue-100 text-blue-700' };
  if (status === 'completed') return { label: 'Завершён', cls: 'bg-gray-100 text-gray-600' };
  return { label: status, cls: 'bg-gray-100 text-gray-500' };
};

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>('tournaments');
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showCreateVenue, setShowCreateVenue] = useState(false);
  const [newTournament, setNewTournament] = useState({
    name: '', city: 'Нижний Новгород', venueId: '1', dateStart: '', dateEnd: '',
    registrationDeadline: '', ageGroup: '10-16', category: 'Любительский',
    maxPlayers: '8', description: '', autoConfirm: true, genderRestriction: '',
  });
  const [newVenue, setNewVenue] = useState({
    name: '', city: 'Нижний Новгород', address: '', type: 'outdoor', courts: '2',
  });

  const TABS = [
    { key: 'tournaments', label: 'Турниры', icon: 'Trophy', count: TOURNAMENTS.length },
    { key: 'venues', label: 'Площадки', icon: 'MapPin', count: VENUES.length },
    { key: 'players', label: 'Игроки', icon: 'Users', count: PLAYERS.length },
  ];

  return (
    <div className="min-h-screen bg-muted/30 font-montserrat">
      {/* Admin header */}
      <div className="bg-tennis-green-dark text-white px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-tennis-yellow rounded-lg flex items-center justify-center">
              <Icon name="ShieldCheck" size={16} className="text-tennis-green-dark" />
            </div>
            <div>
              <div className="font-oswald font-bold text-base">ЛДТТНН · Администратор</div>
              <div className="text-white/50 text-xs">Панель управления</div>
            </div>
          </div>
          <a href="/" className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors">
            <Icon name="ExternalLink" size={14} />
            Сайт
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Игроков', value: PLAYERS.length, icon: 'Users', color: 'bg-blue-50 border-blue-200' },
            { label: 'Турниров', value: TOURNAMENTS.length, icon: 'Trophy', color: 'bg-tennis-yellow/10 border-tennis-yellow/30' },
            { label: 'Площадок', value: VENUES.length, icon: 'MapPin', color: 'bg-green-50 border-green-200' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-2xl border ${s.color} p-4 text-center`}>
              <div className="font-oswald text-3xl font-bold text-tennis-green">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border rounded-xl p-1 mb-6 shadow-sm">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as AdminTab)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                tab === t.key ? 'bg-tennis-green text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={t.icon} size={15} />
              <span className="hidden sm:inline">{t.label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-white/20 text-white' : 'bg-muted'}`}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Tournaments */}
        {tab === 'tournaments' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Управление турнирами</h2>
              <Button onClick={() => setShowCreateTournament(true)} className="bg-tennis-green hover:bg-tennis-green-light text-white gap-2">
                <Icon name="Plus" size={16} />
                Новый турнир
              </Button>
            </div>
            <div className="space-y-3">
              {TOURNAMENTS.map(t => {
                const st = statusMeta(t.status);
                return (
                  <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${st.cls}`}>{st.label}</span>
                          <span className="text-xs text-muted-foreground">{t.venueType === 'indoor' ? '🏛️' : '☀️'} {t.ageGroup} лет</span>
                        </div>
                        <h3 className="font-bold text-base">{t.name}</h3>
                        <div className="text-sm text-muted-foreground">{t.city} · {t.venueName} · {new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} – {new Date(t.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-semibold text-tennis-green bg-tennis-green/10 px-3 py-1.5 rounded-lg">
                          {t.currentPlayers}/{t.maxPlayers} уч.
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-tennis-green hover:bg-tennis-green/10 rounded-lg transition-colors">
                          <Icon name="Pencil" size={16} />
                        </button>
                        <button className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Icon name="UserPlus" size={16} />
                        </button>
                        {t.status !== 'completed' && (
                          <button className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Icon name="CheckCircle" size={16} />
                          </button>
                        )}
                        <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Venues */}
        {tab === 'venues' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Управление площадками</h2>
              <Button onClick={() => setShowCreateVenue(true)} className="bg-tennis-green hover:bg-tennis-green-light text-white gap-2">
                <Icon name="Plus" size={16} />
                Добавить площадку
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {VENUES.map(v => (
                <div key={v.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.type === 'indoor' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {v.type === 'indoor' ? '🏛️ Крытый' : '☀️ Открытый'}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${v.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                          {v.status === 'open' ? 'Открыта' : 'Закрыта'}
                        </span>
                      </div>
                      <h3 className="font-bold text-base">{v.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">
                        <div>{v.city} · {v.address}</div>
                        <div>{v.courts} корта</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 text-muted-foreground hover:text-tennis-green hover:bg-tennis-green/10 rounded-lg transition-colors">
                        <Icon name="Pencil" size={15} />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                        <Icon name="EyeOff" size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        {tab === 'players' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">Игроки</h2>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Игрок</th>
                    <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Возраст</th>
                    <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden md:table-cell">Тренер</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Очков</th>
                    <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {PLAYERS.map(p => (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.city}</div>
                      </td>
                      <td className="px-3 py-3 text-center hidden sm:table-cell">{p.age}</td>
                      <td className="px-3 py-3 text-center text-muted-foreground hidden md:table-cell">{p.coach}</td>
                      <td className="px-4 py-3 text-right font-bold text-tennis-green">{p.rating}</td>
                      <td className="px-3 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1.5 text-muted-foreground hover:text-tennis-green hover:bg-tennis-green/10 rounded-lg transition-colors">
                            <Icon name="Pencil" size={14} />
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                            <Icon name="Trash2" size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Tournament Modal */}
      <Dialog open={showCreateTournament} onOpenChange={setShowCreateTournament}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-tennis-green">Создать турнир</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Название турнира</label>
              <Input
                value={newTournament.name}
                onChange={e => setNewTournament(p => ({ ...p, name: e.target.value }))}
                placeholder="Весенний Кубок ЛДТТНН"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Город</label>
                <select
                  value={newTournament.city}
                  onChange={e => setNewTournament(p => ({ ...p, city: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
                >
                  {['Нижний Новгород', 'Дзержинск', 'Бор'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Площадка</label>
                <select
                  value={newTournament.venueId}
                  onChange={e => setNewTournament(p => ({ ...p, venueId: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
                >
                  {VENUES.filter(v => v.status === 'open').map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Дата начала</label>
                <Input type="date" value={newTournament.dateStart} onChange={e => setNewTournament(p => ({ ...p, dateStart: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Дата конца</label>
                <Input type="date" value={newTournament.dateEnd} onChange={e => setNewTournament(p => ({ ...p, dateEnd: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Дедлайн регистрации</label>
              <Input type="date" value={newTournament.registrationDeadline} onChange={e => setNewTournament(p => ({ ...p, registrationDeadline: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Возраст</label>
                <select
                  value={newTournament.ageGroup}
                  onChange={e => setNewTournament(p => ({ ...p, ageGroup: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
                >
                  {['10-12', '10-14', '12-16', '10-16'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Категория</label>
                <select
                  value={newTournament.category}
                  onChange={e => setNewTournament(p => ({ ...p, category: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
                >
                  {['Любительский', 'Первенство', 'Районный'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Макс. участников</label>
                <select
                  value={newTournament.maxPlayers}
                  onChange={e => setNewTournament(p => ({ ...p, maxPlayers: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
                >
                  {['4', '8', '12', '16'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Описание</label>
              <textarea
                value={newTournament.description}
                onChange={e => setNewTournament(p => ({ ...p, description: e.target.value }))}
                rows={3}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30 resize-none"
                placeholder="Описание турнира..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoConfirm"
                checked={newTournament.autoConfirm}
                onChange={e => setNewTournament(p => ({ ...p, autoConfirm: e.target.checked }))}
                className="accent-tennis-green"
              />
              <label htmlFor="autoConfirm" className="text-sm font-medium cursor-pointer">Автоподтверждение записи</label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowCreateTournament(false)} className="flex-1">Отмена</Button>
              <Button onClick={() => setShowCreateTournament(false)} className="flex-1 bg-tennis-green hover:bg-tennis-green-light text-white">
                Создать турнир
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Venue Modal */}
      <Dialog open={showCreateVenue} onOpenChange={setShowCreateVenue}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-tennis-green">Добавить площадку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Название</label>
              <Input value={newVenue.name} onChange={e => setNewVenue(p => ({ ...p, name: e.target.value }))} placeholder="ТК Старт" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Город</label>
                <select
                  value={newVenue.city}
                  onChange={e => setNewVenue(p => ({ ...p, city: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none"
                >
                  {['Нижний Новгород', 'Дзержинск', 'Бор'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Тип</label>
                <select
                  value={newVenue.type}
                  onChange={e => setNewVenue(p => ({ ...p, type: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none"
                >
                  <option value="outdoor">☀️ Открытый</option>
                  <option value="indoor">🏛️ Крытый</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Адрес</label>
              <Input value={newVenue.address} onChange={e => setNewVenue(p => ({ ...p, address: e.target.value }))} placeholder="ул. Белинского, 61" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Количество кортов</label>
              <Input type="number" min="1" max="20" value={newVenue.courts} onChange={e => setNewVenue(p => ({ ...p, courts: e.target.value }))} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowCreateVenue(false)} className="flex-1">Отмена</Button>
              <Button onClick={() => setShowCreateVenue(false)} className="flex-1 bg-tennis-green hover:bg-tennis-green-light text-white">
                Добавить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
