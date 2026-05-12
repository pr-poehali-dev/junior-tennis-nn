import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { CURRENT_PLAYER } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export default function ProfilePage() {
  const player = CURRENT_PLAYER;
  const [activeTab, setActiveTab] = useState<'history' | 'upcoming' | 'notifications'>('history');
  const [withdrawn, setWithdrawn] = useState<number[]>([]);

  const canWithdraw = (dateStart: string) => {
    const start = new Date(dateStart);
    const now = new Date();
    const diff = (start.getTime() - now.getTime()) / 1000 / 3600;
    return diff > 48;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="h-24 hero-gradient relative">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)' }}
          />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white bg-tennis-green/20 flex items-center justify-center shadow-lg">
              <Icon name="User" size={36} className="text-tennis-green" />
            </div>
            <div className="sm:pb-1">
              <h1 className="font-oswald text-2xl font-bold text-foreground">{player.name}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{player.age} лет</span>
                <span>·</span>
                <span>{player.city}</span>
                <span>·</span>
                <span>Тренер: {player.coach}</span>
              </div>
            </div>
            <div className="sm:ml-auto flex gap-3">
              <div className="text-center bg-tennis-green rounded-xl px-4 py-2">
                <div className="font-oswald text-xl font-bold text-white">{player.rating}</div>
                <div className="text-xs text-white/70">очков</div>
              </div>
              <div className="text-center bg-tennis-yellow/20 rounded-xl px-4 py-2">
                <div className="font-oswald text-xl font-bold text-tennis-green">#{player.rank}</div>
                <div className="text-xs text-muted-foreground">рейтинг</div>
              </div>
              <div className="text-center bg-muted rounded-xl px-4 py-2">
                <div className="font-oswald text-xl font-bold text-foreground">{player.tournaments}</div>
                <div className="text-xs text-muted-foreground">турниров</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
        {[
          { key: 'history', label: 'История турниров', icon: 'History', badge: 0 },
          { key: 'upcoming', label: 'Ближайшие', icon: 'CalendarClock', badge: player.upcomingTournaments.length },
          { key: 'notifications', label: 'Уведомления', icon: 'Bell', badge: player.notifications.filter(n => !n.read).length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
              activeTab === tab.key
                ? 'bg-white text-tennis-green shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={15} />
            <span className="hidden sm:block">{tab.label}</span>
            {tab.badge > 0 && (
              <span className="w-4 h-4 bg-tennis-yellow text-tennis-green-dark text-xs font-bold rounded-full flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
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
                {player.tournamentHistory.map((t) => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3">
                      <Link to={`/tournament/${t.id}`} className="font-medium text-tennis-green hover:underline">{t.name}</Link>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                        t.place === 1 ? 'bg-tennis-yellow text-tennis-green-dark' :
                        t.place === 2 ? 'bg-gray-200 text-gray-700' :
                        t.place === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {t.place}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-tennis-green">+{t.points}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-tennis-green/20 bg-tennis-green/5">
                  <td colSpan={3} className="px-4 py-3 font-bold text-tennis-green">Итого очков</td>
                  <td className="px-4 py-3 text-right font-oswald font-bold text-xl text-tennis-green">
                    {player.tournamentHistory.reduce((s, t) => s + t.points, 0)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Upcoming */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {player.upcomingTournaments.map((t) => {
            const isWithdrawn = withdrawn.includes(t.id);
            const canW = canWithdraw(t.dateStart);
            return (
              <div key={t.id} className="bg-white rounded-2xl border border-border shadow-sm p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs bg-tennis-yellow text-tennis-green-dark font-bold px-2.5 py-1 rounded-full">Вы записаны</span>
                      <span className="text-xs text-muted-foreground">{t.venueType === 'indoor' ? '🏛️' : '☀️'}</span>
                    </div>
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
                      <button
                        onClick={() => setWithdrawn(prev => [...prev, t.id])}
                        className="text-xs text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg font-medium transition-colors"
                      >
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
          {player.upcomingTournaments.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Icon name="CalendarX" size={36} className="mx-auto mb-3 opacity-40" />
              <div>Нет записей на ближайшие турниры</div>
              <Link to="/calendar" className="text-tennis-green font-semibold text-sm mt-2 inline-block hover:underline">
                Перейти к календарю →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-2">
          {player.notifications.map((n) => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${!n.read ? 'border-tennis-green/30 bg-tennis-green/5' : 'border-border'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${!n.read ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground'}`}>
                <Icon name="Bell" size={14} />
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
    </div>
  );
}
