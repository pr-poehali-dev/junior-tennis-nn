import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS } from '@/data/mockData';
import { getSession, getPlayers, logout } from '@/data/authStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const session = getSession();
  const players = getPlayers();
  const player = session ? players.find(p => p.id === session.id) : null;

  const [activeTab, setActiveTab] = useState<'history' | 'upcoming' | 'notifications'>('history');
  const [withdrawn, setWithdrawn] = useState<number[]>([]);

  if (!session || session.role !== 'player') {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-sm">
        <div className="text-5xl mb-4">🎾</div>
        <h2 className="font-oswald text-2xl font-bold mb-3">Войдите в профиль</h2>
        <p className="text-muted-foreground text-sm mb-6">Создайте аккаунт игрока или войдите с паролем</p>
        <Link to="/auth" className="inline-flex items-center gap-2 bg-tennis-green text-white font-bold px-6 py-3 rounded-xl hover:bg-tennis-green-light transition-colors">
          <Icon name="LogIn" size={18} />
          Войти / Регистрация
        </Link>
      </div>
    );
  }

  if (!player) {
    logout();
    navigate('/auth');
    return null;
  }

  const today = new Date();
  const birth = new Date(player.birthDate);
  const isBirthday = today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();

  const canWithdraw = (dateStart: string) => {
    const start = new Date(dateStart);
    return (start.getTime() - today.getTime()) / 1000 / 3600 > 48;
  };

  const upcomingTournaments = TOURNAMENTS.filter(t => t.status === 'registration' || t.status === 'upcoming').slice(0, 3);

  const tournamentHistory = player.rankHistory.length > 0 ? [
    { id: 3, date: '12–13 апр 2026', name: 'Турнир «Крытый корт»', place: 1, points: 8 },
  ] : [];

  const notifications = [
    ...(isBirthday ? [{ id: 0, text: `🎂 С Днём рождения, ${player.firstName}! Желаем больших побед!`, date: today.toISOString().slice(0, 10), read: false, special: true }] : []),
    ...player.rankHistory.map((rh, i) => ({
      id: 100 + i,
      text: `${rh.change > 0 ? '📈' : '📉'} Рейтинг изменён на ${rh.change > 0 ? '+' : ''}${rh.change}: ${rh.reason}`,
      date: rh.date,
      read: false,
      special: false,
    })),
    { id: 1, text: 'Добро пожаловать в ЛДТТНН! Запишитесь на первый турнир.', date: today.toISOString().slice(0, 10), read: true, special: false },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {isBirthday && (
        <div className="bg-gradient-to-r from-tennis-yellow to-tennis-yellow-light rounded-2xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
          <span className="text-3xl">🎂</span>
          <div>
            <div className="font-oswald font-bold text-lg text-tennis-green-dark">С Днём рождения, {player.firstName}!</div>
            <div className="text-tennis-green-dark/70 text-sm">Желаем побед и отличной игры!</div>
          </div>
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="h-24 hero-gradient relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }} />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-tennis-green/10 flex items-center justify-center shadow-lg text-4xl">
              {player.emoji}
            </div>
            <div className="sm:pb-1">
              <h1 className="font-oswald text-2xl font-bold">{player.firstName} {player.lastName}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-tennis-green">«{player.nickname}»</span>
                <span>·</span>
                <span>{player.city}</span>
                <span>·</span>
                <span>{player.gender === 'male' ? '♂' : '♀'}</span>
                <span>·</span>
                <span>{player.hand === 'right' ? '✋ Правша' : '🤚 Левша'}</span>
                <span>·</span>
                <span className="text-xs">Тренер: {player.coach}</span>
              </div>
            </div>
            <div className="sm:ml-auto flex gap-3 flex-wrap">
              <div className="text-center bg-tennis-green rounded-xl px-4 py-2">
                <div className="font-oswald text-xl font-bold text-white">{player.rating}</div>
                <div className="text-xs text-white/70">очков</div>
              </div>
              {player.rank > 0 && (
                <div className="text-center bg-tennis-yellow/20 rounded-xl px-4 py-2">
                  <div className="font-oswald text-xl font-bold text-tennis-green">#{player.rank}</div>
                  <div className="text-xs text-muted-foreground">рейтинг</div>
                </div>
              )}
              <div className="text-center bg-muted rounded-xl px-4 py-2">
                <div className="font-oswald text-xl font-bold">{player.tournaments}</div>
                <div className="text-xs text-muted-foreground">турниров</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
        {[
          { key: 'history', label: 'История', icon: 'History' },
          { key: 'upcoming', label: 'Ближайшие', icon: 'CalendarClock' },
          { key: 'notifications', label: 'Уведомления', icon: 'Bell', badge: notifications.filter(n => !n.read).length },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-white text-tennis-green shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <Icon name={tab.icon} size={15} />
            <span className="hidden sm:block">{tab.label}</span>
            {'badge' in tab && (tab.badge as number) > 0 && (
              <span className="w-4 h-4 bg-tennis-yellow text-tennis-green-dark text-xs font-bold rounded-full flex items-center justify-center">{tab.badge}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {tournamentHistory.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Icon name="History" size={32} className="mx-auto mb-3 opacity-30" />
              <div className="text-sm">Вы ещё не участвовали в турнирах</div>
              <Link to="/calendar" className="text-tennis-green font-semibold text-sm mt-2 inline-block hover:underline">Перейти к календарю →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Дата</th>
                    <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Турнир</th>
                    <th className="text-center px-3 py-3 font-semibold text-muted-foreground">Место</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Очки</th>
                  </tr>
                </thead>
                <tbody>
                  {tournamentHistory.map(t => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.date}</td>
                      <td className="px-4 py-3">
                        <Link to={`/tournament/${t.id}`} className="font-medium text-tennis-green hover:underline">{t.name}</Link>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${t.place === 1 ? 'bg-tennis-yellow text-tennis-green-dark' : t.place === 2 ? 'bg-gray-200 text-gray-700' : t.place === 3 ? 'bg-orange-100 text-orange-700' : 'bg-muted text-muted-foreground'}`}>
                          {t.place}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-tennis-green">+{t.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingTournaments.map(t => {
            const isWithdrawn = withdrawn.includes(t.id);
            const canW = canWithdraw(t.dateStart);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs bg-tennis-yellow text-tennis-green-dark font-bold px-2.5 py-1 rounded-full inline-block mb-2">Открыта запись</span>
                    <h3 className="font-bold text-base mb-1">{t.name}</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-2"><Icon name="Calendar" size={13} />{new Date(t.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} – {new Date(t.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                      <div className="flex items-center gap-2"><Icon name="MapPin" size={13} />{t.city} · {t.venueName}</div>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {isWithdrawn ? (
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">Отказ подан</span>
                    ) : canW ? (
                      <button onClick={() => setWithdrawn(prev => [...prev, t.id])}
                        className="text-xs text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors">
                        Отказаться
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-lg">Отказ недоступен</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <Link to="/calendar" className="block text-center py-3 rounded-2xl border-2 border-dashed border-tennis-green/30 text-tennis-green font-semibold text-sm hover:border-tennis-green/60 transition-colors">
            + Записаться на турнир
          </Link>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-2">
          {notifications.map(n => (
            <div key={n.id} className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${n.special ? 'border-tennis-yellow/50 bg-tennis-yellow/10' : !n.read ? 'border-tennis-green/30 bg-tennis-green/5' : 'border-border'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-sm ${n.special ? 'bg-tennis-yellow text-lg' : !n.read ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground'}`}>
                {n.special ? '🎂' : <Icon name="Bell" size={14} />}
              </div>
              <div className="flex-1">
                <div className={`text-sm ${!n.read ? 'font-semibold' : ''}`}>{n.text}</div>
                <div className="text-xs text-muted-foreground mt-1">{new Date(n.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
              </div>
              {!n.read && <div className="w-2 h-2 bg-tennis-yellow rounded-full mt-2 shrink-0" />}
            </div>
          ))}
        </div>
      )}

      {/* Logout */}
      <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Вошли как: <strong>{player.firstName} {player.lastName}</strong></span>
        <button onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-red-500 transition-colors font-medium">
          <Icon name="LogOut" size={15} />
          Сменить профиль
        </button>
      </div>
    </div>
  );
}
