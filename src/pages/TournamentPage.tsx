import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { TOURNAMENTS, TOURNAMENT_RESULTS, PLAYERS } from '@/data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function TournamentPage() {
  const { id } = useParams();
  const tournament = TOURNAMENTS.find(t => t.id === Number(id));
  const results = TOURNAMENT_RESULTS[Number(id) as keyof typeof TOURNAMENT_RESULTS];
  const [scoreModal, setScoreModal] = useState<{ p1: string; p2: string; score: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'bracket' | 'players' | 'results'>('bracket');

  if (!tournament) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Icon name="AlertCircle" size={40} className="mx-auto mb-4 text-muted-foreground" />
        <h2 className="font-oswald text-2xl font-bold mb-2">Турнир не найден</h2>
        <Link to="/calendar" className="text-tennis-green hover:underline">← Вернуться к календарю</Link>
      </div>
    );
  }

  const isCompleted = tournament.status === 'completed';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Link to="/calendar" className="inline-flex items-center gap-1 text-muted-foreground hover:text-tennis-green text-sm mb-6 transition-colors">
        <Icon name="ChevronLeft" size={16} />
        Календарь
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-tennis-green via-tennis-green-light to-tennis-yellow" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-tennis-yellow text-tennis-green-dark'
                }`}>
                  {isCompleted ? 'Завершён' : 'Регистрация открыта'}
                </span>
                <span className="text-xs text-muted-foreground">{tournament.venueType === 'indoor' ? '🏛️ Крытый' : '☀️ Открытый'}</span>
              </div>
              <h1 className="font-oswald text-3xl font-bold text-foreground mb-3">{tournament.name}</h1>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Calendar" size={15} />
                  {new Date(tournament.dateStart).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })} – {new Date(tournament.dateEnd).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="MapPin" size={15} />
                  {tournament.city} · {tournament.venueName}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Navigation" size={15} />
                  {tournament.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Phone" size={15} />
                  {tournament.contact}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
              <div className="bg-muted rounded-xl p-4 text-center min-w-[120px]">
                <div className="font-oswald text-2xl font-bold text-tennis-green">{tournament.currentPlayers}/{tournament.maxPlayers}</div>
                <div className="text-xs text-muted-foreground">участников</div>
              </div>
              <div className="bg-muted rounded-xl px-3 py-2 text-center">
                <div className="text-xs text-muted-foreground">Возраст</div>
                <div className="font-bold text-sm">{tournament.ageGroup} лет</div>
              </div>
            </div>
          </div>

          {tournament.description && (
            <p className="mt-4 text-sm text-muted-foreground bg-muted/50 rounded-xl p-3">{tournament.description}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6">
        {[
          { key: 'bracket', label: 'Сетка турнира', icon: 'GitBranch' },
          { key: 'players', label: 'Участники', icon: 'Users' },
          ...(isCompleted ? [{ key: 'results', label: 'Итоги', icon: 'Award' }] : []),
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white text-tennis-green shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab.icon} size={15} />
            <span className="hidden sm:block">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Bracket */}
      {activeTab === 'bracket' && (
        <div className="space-y-6">
          {results ? (
            <>
              {/* Groups */}
              <div className="grid md:grid-cols-2 gap-6">
                {results.groups.map((group) => (
                  <div key={group.name} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                    <div className="bg-tennis-green/10 px-4 py-3 border-b border-border">
                      <h3 className="font-bold text-tennis-green">{group.name}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Игрок</th>
                            <th className="text-center px-2 py-2 font-semibold text-muted-foreground">В</th>
                            <th className="text-center px-2 py-2 font-semibold text-muted-foreground">П</th>
                            <th className="text-center px-2 py-2 font-semibold text-muted-foreground">Оч</th>
                          </tr>
                        </thead>
                        <tbody>
                          {group.standings.map((s, idx) => (
                            <tr key={s.player.id} className={`border-b border-border last:border-0 ${idx < 2 ? 'bg-tennis-green/5' : ''}`}>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-2">
                                  <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold ${idx < 2 ? 'bg-tennis-yellow text-tennis-green-dark' : 'bg-muted text-muted-foreground'}`}>
                                    {idx + 1}
                                  </span>
                                  {s.player.firstName} {s.player.lastName}
                                </div>
                              </td>
                              <td className="text-center px-2 py-2.5 font-semibold text-green-600">{s.w}</td>
                              <td className="text-center px-2 py-2.5 text-red-400">{s.l}</td>
                              <td className="text-center px-2 py-2.5 font-bold text-tennis-green">{s.pts}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Match results */}
                    <div className="px-4 py-3 border-t border-border">
                      <div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-wide">Матчи</div>
                      <div className="space-y-1">
                        {group.results.map((r, idx) => (
                          <button
                            key={idx}
                            onClick={() => setScoreModal({
                              p1: `${group.players[r.p1].firstName} ${group.players[r.p1].lastName}`,
                              p2: `${group.players[r.p2].firstName} ${group.players[r.p2].lastName}`,
                              score: r.score,
                            })}
                            className="w-full flex items-center justify-between text-xs bg-muted/50 hover:bg-muted rounded-lg px-3 py-1.5 transition-colors match-cell"
                          >
                            <span className="font-medium">{group.players[r.p1].name}</span>
                            <span className="bg-tennis-green text-white font-bold px-2 py-0.5 rounded text-xs mx-2">{r.score}</span>
                            <span className="font-medium">{group.players[r.p2].name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Playoff */}
              <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="bg-tennis-yellow/20 px-4 py-3 border-b border-border">
                  <h3 className="font-bold text-tennis-green-dark flex items-center gap-2">
                    <Icon name="Trophy" size={16} />
                    Плей-офф
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Финал</div>
                      <button
                        onClick={() => setScoreModal({
                          p1: `${results.playoff.final.p1.firstName} ${results.playoff.final.p1.lastName}`,
                          p2: `${results.playoff.final.p2.firstName} ${results.playoff.final.p2.lastName}`,
                          score: results.playoff.final.score,
                        })}
                        className="w-full match-cell"
                      >
                        <div className="border border-tennis-yellow rounded-xl overflow-hidden">
                          <div className={`flex items-center justify-between px-4 py-3 ${results.playoff.final.winner.id === results.playoff.final.p1.id ? 'bg-tennis-yellow/30 font-bold' : 'bg-background'}`}>
                            <div className="flex items-center gap-2">
                              {results.playoff.final.winner.id === results.playoff.final.p1.id && <Icon name="Crown" size={14} className="text-tennis-yellow" />}
                              <span className="text-sm">{results.playoff.final.p1.firstName} {results.playoff.final.p1.lastName}</span>
                            </div>
                          </div>
                          <div className="border-t border-tennis-yellow/30 text-center py-1 text-xs font-bold text-tennis-green bg-tennis-yellow/10">
                            {results.playoff.final.score}
                          </div>
                          <div className={`flex items-center justify-between px-4 py-3 ${results.playoff.final.winner.id === results.playoff.final.p2.id ? 'bg-tennis-yellow/30 font-bold' : 'bg-background'}`}>
                            <div className="flex items-center gap-2">
                              {results.playoff.final.winner.id === results.playoff.final.p2.id && <Icon name="Crown" size={14} className="text-tennis-yellow" />}
                              <span className="text-sm">{results.playoff.final.p2.firstName} {results.playoff.final.p2.lastName}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>
                    {results.playoff.thirdPlace && (
                      <div>
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-3">Матч за 3-е место</div>
                        <button
                          onClick={() => setScoreModal({
                            p1: `${results.playoff.thirdPlace!.p1.firstName} ${results.playoff.thirdPlace!.p1.lastName}`,
                            p2: `${results.playoff.thirdPlace!.p2.firstName} ${results.playoff.thirdPlace!.p2.lastName}`,
                            score: results.playoff.thirdPlace!.score,
                          })}
                          className="w-full match-cell"
                        >
                          <div className="border border-border rounded-xl overflow-hidden">
                            <div className={`flex items-center px-4 py-3 text-sm ${results.playoff.thirdPlace.winner.id === results.playoff.thirdPlace.p1.id ? 'font-bold' : ''}`}>
                              {results.playoff.thirdPlace.p1.firstName} {results.playoff.thirdPlace.p1.lastName}
                            </div>
                            <div className="border-t border-border text-center py-1 text-xs font-bold text-tennis-green bg-muted/50">
                              {results.playoff.thirdPlace.score}
                            </div>
                            <div className={`flex items-center px-4 py-3 text-sm ${results.playoff.thirdPlace.winner.id === results.playoff.thirdPlace.p2.id ? 'font-bold' : ''}`}>
                              {results.playoff.thirdPlace.p2.firstName} {results.playoff.thirdPlace.p2.lastName}
                            </div>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-border shadow-sm p-10 text-center">
              <Icon name="GitBranch" size={40} className="mx-auto mb-3 text-muted-foreground/40" />
              <div className="text-muted-foreground">Сетка будет доступна после жеребьёвки</div>
            </div>
          )}
        </div>
      )}

      {/* Players list */}
      {activeTab === 'players' && (
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <span className="font-bold text-sm">{tournament.currentPlayers} участников</span>
            <span className="text-sm text-muted-foreground">Макс: {tournament.maxPlayers}</span>
          </div>
          {PLAYERS.slice(0, tournament.currentPlayers).map((p, i) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">{i + 1}</span>
              <div className="w-9 h-9 rounded-full bg-tennis-green/10 flex items-center justify-center shrink-0 text-lg">
                {p.emoji || '🎾'}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{p.firstName} {p.lastName}</div>
                <div className="text-xs text-muted-foreground">«{p.nickname}» · {p.city}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm text-tennis-green">{p.rating} оч.</div>
                <div className="text-xs text-muted-foreground">Рейтинг</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Final results */}
      {activeTab === 'results' && results && (
        <div>
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-4">
            <div className="bg-tennis-yellow/10 px-4 py-3 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-tennis-green flex items-center gap-2">
                <Icon name="Award" size={16} />
                Итоговая таблица
              </h3>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-tennis-green bg-tennis-green/10 hover:bg-tennis-green/20 px-3 py-1.5 rounded-lg transition-colors">
                <Icon name="Download" size={13} />
                Скачать PDF
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Место</th>
                  <th className="text-left px-4 py-2.5 font-semibold text-muted-foreground">Игрок</th>
                  <th className="text-right px-4 py-2.5 font-semibold text-muted-foreground">Очки</th>
                </tr>
              </thead>
              <tbody>
                {results.finalStandings.map((s, i) => (
                  <tr key={s.player.id} className={`border-b border-border last:border-0 ${i < 3 ? 'bg-tennis-yellow/5' : ''}`}>
                    <td className="px-4 py-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold inline-flex ${
                        s.place === 1 ? 'bg-tennis-yellow text-tennis-green-dark' :
                        s.place === 2 ? 'bg-gray-200 text-gray-700' :
                        s.place === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {s.place}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{s.player.firstName} {s.player.lastName}</td>
                    <td className="px-4 py-3 text-right font-bold text-tennis-green">+{s.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tournament gallery */}
      {tournament.photos && tournament.photos.length > 0 && (
        <div className="mt-8">
          <h2 className="font-oswald text-xl font-bold text-tennis-green mb-4 flex items-center gap-2">
            <Icon name="Camera" size={20} />
            Фотогалерея турнира
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {tournament.photos.map(photo => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-muted group cursor-pointer card-hover">
                <img src={photo.url} alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score modal */}
      <Dialog open={!!scoreModal} onOpenChange={() => setScoreModal(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-oswald text-tennis-green">Счёт матча</DialogTitle>
          </DialogHeader>
          {scoreModal && (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">{scoreModal.p1}</span>
                </div>
                <div className="text-center">
                  <span className="font-oswald text-2xl font-bold text-tennis-green">{scoreModal.score}</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-semibold text-sm text-muted-foreground">{scoreModal.p2}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}