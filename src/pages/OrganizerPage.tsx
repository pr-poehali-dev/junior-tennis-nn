import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, NNO_CITIES, VENUES } from '@/data/mockData';
import { ORGANIZER_ACCOUNT, getSession, logout } from '@/data/authStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OrganizerPage() {
  const navigate = useNavigate();
  const session = getSession();
  const org = ORGANIZER_ACCOUNT;
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [pendingSubmitted, setPendingSubmitted] = useState(false);
  const [newT, setNewT] = useState({
    name: '', city: NNO_CITIES[0], venueId: '1', dateStart: '', dateEnd: '',
    registrationDeadline: '', ageGroup: '10-16', category: 'Любительский',
    maxPlayers: '8', description: '',
    genderRestriction: 'none', format: 'singles',
  });

  if (!session || session.role !== 'organizer') {
    navigate('/auth');
    return null;
  }

  const myTournaments = TOURNAMENTS.filter(t => t.status === 'completed').slice(0, 5);

  const handleSubmit = () => {
    setPendingSubmitted(true);
    setShowCreateModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Organizer card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-400 relative" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-blue-100 flex items-center justify-center shadow-lg text-4xl">
              {org.emoji}
            </div>
            <div className="sm:pb-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">Организатор</span>
              </div>
              <h1 className="font-oswald text-2xl font-bold">{org.name}</h1>
            </div>
            <div className="sm:ml-auto flex gap-3">
              <div className="text-center bg-blue-50 rounded-xl px-4 py-2">
                <div className="font-oswald text-2xl font-bold text-blue-600">{org.tournamentsCreated}</div>
                <div className="text-xs text-muted-foreground">турниров</div>
              </div>
              <div className="text-center bg-tennis-yellow/20 rounded-xl px-4 py-2">
                <div className="font-oswald text-2xl font-bold text-tennis-green">{org.avgRating.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">рейтинг</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
          <div className="font-oswald text-3xl font-bold text-blue-600">{org.tournamentsCreated}</div>
          <div className="text-sm text-muted-foreground">Проведено</div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
          <div className="font-oswald text-3xl font-bold text-tennis-yellow">{org.avgRating.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Средний рейтинг</div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-4 text-center shadow-sm">
          <div className="font-oswald text-3xl font-bold text-tennis-green">#1</div>
          <div className="text-sm text-muted-foreground">Среди орг.</div>
        </div>
      </div>

      {/* Notifications */}
      {pendingSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <Icon name="CheckCircle" size={20} className="text-green-600 shrink-0" />
          <div>
            <div className="font-semibold text-green-800 text-sm">Заявка отправлена!</div>
            <div className="text-green-700 text-xs">Администратор рассмотрит её в течение 24 часов. После одобрения турнир появится в календаре.</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 mb-8">
        <Button onClick={() => setShowCreateModal(true)} className="bg-tennis-green hover:bg-tennis-green-light text-white gap-2 font-bold">
          <Icon name="Plus" size={16} />
          Создать турнир
        </Button>
        <Button variant="outline" onClick={() => { logout(); navigate('/auth'); }} className="gap-2">
          <Icon name="LogOut" size={16} />
          Выйти
        </Button>
      </div>

      {/* My tournaments */}
      <h2 className="font-oswald text-xl font-bold mb-4">Мои турниры</h2>
      {myTournaments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center text-muted-foreground">
          <Icon name="CalendarX" size={36} className="mx-auto mb-3 opacity-40" />
          <div>Вы ещё не проводили турниры</div>
        </div>
      ) : (
        <div className="space-y-3">
          {myTournaments.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base">{t.name}</h3>
                  <div className="text-sm text-muted-foreground">{t.city} · {new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div className="flex items-center gap-3">
                  {t.rating && (
                    <div className="text-center">
                      <div className="font-oswald font-bold text-lg text-tennis-yellow">{t.rating}</div>
                      <div className="text-xs text-muted-foreground">оценка</div>
                    </div>
                  )}
                  <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-bold">Завершён</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create tournament modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-oswald text-xl text-tennis-green">Заявка на проведение турнира</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-sm text-orange-700">
              После отправки заявку рассматривает администратор. Турнир появится в календаре только после одобрения.
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Название *</label>
              <Input value={newT.name} onChange={e => setNewT(p => ({ ...p, name: e.target.value }))} placeholder="Весенний Кубок" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Город *</label>
                <select value={newT.city} onChange={e => setNewT(p => ({ ...p, city: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
                  {NNO_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Площадка *</label>
                <select value={newT.venueId} onChange={e => setNewT(p => ({ ...p, venueId: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
                  {VENUES.filter(v => v.status === 'open').map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Дата начала *</label>
                <Input type="date" value={newT.dateStart} onChange={e => setNewT(p => ({ ...p, dateStart: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Дата конца *</label>
                <Input type="date" value={newT.dateEnd} onChange={e => setNewT(p => ({ ...p, dateEnd: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Дедлайн записи *</label>
              <Input type="date" value={newT.registrationDeadline} onChange={e => setNewT(p => ({ ...p, registrationDeadline: e.target.value }))} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Возраст</label>
                <select value={newT.ageGroup} onChange={e => setNewT(p => ({ ...p, ageGroup: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none">
                  {['10-12', '10-14', '12-16', '10-16'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Формат</label>
                <select value={newT.format} onChange={e => setNewT(p => ({ ...p, format: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none">
                  <option value="singles">Одиночный</option>
                  <option value="doubles">Парный</option>
                  <option value="mixed_doubles">Микст</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Мест</label>
                <select value={newT.maxPlayers} onChange={e => setNewT(p => ({ ...p, maxPlayers: e.target.value }))}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none">
                  {['4', '8', '12', '16'].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Пол участников</label>
              <select value={newT.genderRestriction} onChange={e => setNewT(p => ({ ...p, genderRestriction: e.target.value }))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none">
                <option value="none">Без ограничений</option>
                <option value="male">Только мужской</option>
                <option value="female">Только женский</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Описание</label>
              <textarea value={newT.description} onChange={e => setNewT(p => ({ ...p, description: e.target.value }))}
                rows={3} className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30 resize-none"
                placeholder="Описание турнира..." />
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">Отмена</Button>
              <Button onClick={handleSubmit} className="flex-1 bg-tennis-green hover:bg-tennis-green-light text-white">
                Отправить заявку
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}