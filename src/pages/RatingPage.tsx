import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { NNO_CITIES } from '@/data/mockData';
import { getPlayers } from '@/data/authStore';

const SEASONS = ['2026', '2025'];

export default function RatingPage() {
  const PLAYERS = getPlayers();
  const [filterCity, setFilterCity] = useState('all');
  const [filterSeason, setFilterSeason] = useState('2026');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => PLAYERS.filter(p => {
    if (filterCity !== 'all' && p.city !== filterCity) return false;
    if (filterGender !== 'all' && p.gender !== filterGender) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.firstName.toLowerCase().includes(q) &&
          !p.lastName.toLowerCase().includes(q) &&
          !p.nickname.toLowerCase().includes(q)) return false;
    }
    return true;
  }), [PLAYERS, filterCity, filterGender, search]);

  const maleFiltered = filtered.filter(p => p.gender === 'male').sort((a, b) => b.rating - a.rating);
  const femaleFiltered = filtered.filter(p => p.gender === 'female').sort((a, b) => b.rating - a.rating);
  const showAll = filterGender === 'all';

  const handleExport = () => {
    const header = 'Место\tИгрок\tНикнейм\tГород\tТурниров\tОчков\tПол';
    const rows = filtered.map((p, i) => `${i + 1}\t${p.firstName} ${p.lastName}\t${p.nickname}\t${p.city}\t${p.tournaments}\t${p.rating}\t${p.gender === 'male' ? 'М' : 'Ж'}`);
    const content = [header, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rating_ЛДТТНН_${filterSeason}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const PlayerTable = ({ players, label }: { players: typeof PLAYERS; label: string }) => (
    <div className="mb-8">
      {showAll && (
        <div className="flex items-center gap-2 mb-3">
          <span className="font-oswald text-lg font-bold text-foreground">{label}</span>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{players.length} игроков</span>
        </div>
      )}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        {players.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground text-sm">Нет игроков в этой категории</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-14">Место</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Игрок</th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden md:table-cell">Город</th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Турниров</th>
                  <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Очков</th>
                  <th className="text-center px-3 py-3 font-semibold text-muted-foreground w-14">±</th>
                </tr>
              </thead>
              <tbody>
                {players.map((p, i) => (
                  <tr key={p.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i < 3 ? 'bg-tennis-yellow/5' : ''}`}>
                    <td className="px-4 py-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        i === 0 ? 'bg-tennis-yellow text-tennis-green-dark' :
                        i === 1 ? 'bg-gray-200 text-gray-700' :
                        i === 2 ? 'bg-orange-100 text-orange-700' :
                        'bg-muted text-muted-foreground'
                      }`}>{i + 1}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-tennis-green/10 flex items-center justify-center shrink-0 text-lg">
                          {p.emoji || '🎾'}
                        </div>
                        <div>
                          <div className="font-semibold">{p.firstName} {p.lastName}</div>
                          <div className="text-xs text-muted-foreground">«{p.nickname}» · <span className="hidden sm:inline">{p.city}</span></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-muted-foreground hidden md:table-cell">{p.city}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">{p.tournaments}</td>
                    <td className="px-4 py-3 text-right font-oswald font-bold text-lg text-tennis-green">{p.rating}</td>
                    <td className="px-3 py-3 text-center">
                      {p.rankChange > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-green-500 text-xs font-bold"><Icon name="TrendingUp" size={12} />+{p.rankChange}</span>
                      ) : p.rankChange < 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-bold"><Icon name="TrendingDown" size={12} />{p.rankChange}</span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-oswald text-3xl font-bold text-tennis-green">Рейтинг игроков</h1>
          <p className="text-muted-foreground">Сезон {filterSeason} · ЛДТТНН</p>
        </div>
        <button onClick={handleExport}
          className="inline-flex items-center gap-2 bg-tennis-green text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-tennis-green-light transition-colors">
          <Icon name="Download" size={16} />
          Экспорт Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Имя или никнейм..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30" />
          </div>
          <select value={filterCity} onChange={e => setFilterCity(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30">
            <option value="all">Все города НО</option>
            {NNO_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {/* Gender switcher */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {([['all', 'Все'], ['male', '♂ Мужской'], ['female', '♀ Женский']] as const).map(([val, lbl]) => (
              <button key={val} onClick={() => setFilterGender(val)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${filterGender === val ? 'bg-white text-tennis-green shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
                {lbl}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {SEASONS.map(s => (
              <button key={s} onClick={() => setFilterSeason(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${filterSeason === s ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ratings */}
      {filterGender === 'female' ? (
        <PlayerTable players={femaleFiltered} label="Женский рейтинг" />
      ) : filterGender === 'male' ? (
        <PlayerTable players={maleFiltered} label="Мужской рейтинг" />
      ) : (
        <>
          <PlayerTable players={maleFiltered} label="♂ Мужской рейтинг" />
          <PlayerTable players={femaleFiltered} label="♀ Женский рейтинг" />
        </>
      )}

      {/* Points system */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-tennis-green">
          <Icon name="Info" size={16} />
          Система очков
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2"><Icon name="ChevronRight" size={14} className="shrink-0 mt-0.5 text-tennis-green" />Последнее место — 1 очко, каждое следующее +1</div>
          <div className="flex items-start gap-2"><Icon name="ChevronRight" size={14} className="shrink-0 mt-0.5 text-tennis-green" />Техническое поражение — 0 очков</div>
          <div className="flex items-start gap-2"><Icon name="Star" size={14} className="shrink-0 mt-0.5 text-tennis-yellow" /><span><strong>Бонус +2 очка</strong> за победу над игроком из топ-5 рейтинга</span></div>
        </div>
      </div>
    </div>
  );
}
