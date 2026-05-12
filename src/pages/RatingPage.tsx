import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { PLAYERS } from '@/data/mockData';

const CITIES = ['all', 'Нижний Новгород', 'Дзержинск', 'Бор'];
const AGE_GROUPS = [
  { value: 'all', label: 'Все возрасты' },
  { value: '10-12', label: '10–12 лет' },
  { value: '13-14', label: '13–14 лет' },
  { value: '15-16', label: '15–16 лет' },
];
const SEASONS = ['2026', '2025'];

export default function RatingPage() {
  const [filterCity, setFilterCity] = useState('all');
  const [filterAge, setFilterAge] = useState('all');
  const [filterSeason, setFilterSeason] = useState('2026');
  const [search, setSearch] = useState('');

  const filtered = PLAYERS.filter(p => {
    if (filterCity !== 'all' && p.city !== filterCity) return false;
    if (filterAge !== 'all') {
      const [min, max] = filterAge.split('-').map(Number);
      if (p.age < min || p.age > max) return false;
    }
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleExport = () => {
    const header = 'Место\tИгрок\tВозраст\tГород\tТурниров\tОчков';
    const rows = filtered.map(p => `${p.rank}\t${p.name}\t${p.age}\t${p.city}\t${p.tournaments}\t${p.rating}`);
    const content = [header, ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rating_ЛДТТНН_${filterSeason}.tsv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-oswald text-3xl font-bold text-tennis-green">Рейтинг игроков</h1>
          <p className="text-muted-foreground">Сезон {filterSeason} · ЛДТТНН</p>
        </div>
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 bg-tennis-green text-white font-semibold px-4 py-2.5 rounded-xl text-sm hover:bg-tennis-green-light transition-colors"
        >
          <Icon name="Download" size={16} />
          Экспорт Excel
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
            />
          </div>
          <select
            value={filterCity}
            onChange={e => setFilterCity(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
          >
            {CITIES.map(c => <option key={c} value={c}>{c === 'all' ? 'Все города' : c}</option>)}
          </select>
          <select
            value={filterAge}
            onChange={e => setFilterAge(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-tennis-green/30"
          >
            {AGE_GROUPS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
          </select>
          <div className="flex gap-1">
            {SEASONS.map(s => (
              <button
                key={s}
                onClick={() => setFilterSeason(s)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  filterSeason === s ? 'bg-tennis-green text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 podium */}
      {filtered.length >= 3 && !search && filterCity === 'all' && filterAge === 'all' && (
        <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg mx-auto">
          {[filtered[1], filtered[0], filtered[2]].map((p, podiumIdx) => {
            const realIdx = [1, 0, 2][podiumIdx];
            const heights = ['h-20', 'h-28', 'h-16'];
            const medals = ['🥈', '🥇', '🥉'];
            const bg = ['bg-gray-100', 'bg-tennis-yellow/20 border border-tennis-yellow', 'bg-orange-50'];
            return (
              <div key={p.id} className={`rounded-2xl ${bg[podiumIdx]} p-3 text-center flex flex-col items-center`}>
                <div className="text-2xl mb-1">{medals[podiumIdx]}</div>
                <div className="w-10 h-10 bg-tennis-green/10 rounded-full flex items-center justify-center mb-1">
                  <Icon name="User" size={20} className="text-tennis-green" />
                </div>
                <div className="font-bold text-xs text-center leading-tight mb-1">{p.name.split(' ')[0]}</div>
                <div className="font-oswald font-bold text-tennis-green text-sm">{p.rating}</div>
                <div className="text-xs text-muted-foreground">очков</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-14">Место</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Игрок</th>
                <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Возраст</th>
                <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden md:table-cell">Город</th>
                <th className="text-center px-3 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Турниров</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Очков</th>
                <th className="text-center px-3 py-3 font-semibold text-muted-foreground w-14">±</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr
                  key={p.id}
                  className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i < 3 ? 'bg-tennis-yellow/5' : ''}`}
                >
                  <td className="px-4 py-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-tennis-yellow text-tennis-green-dark' :
                      i === 1 ? 'bg-gray-200 text-gray-700' :
                      i === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {p.rank}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-tennis-green/10 flex items-center justify-center shrink-0">
                        <Icon name="User" size={16} className="text-tennis-green" />
                      </div>
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{p.age} лет · {p.city}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center text-muted-foreground hidden sm:table-cell">{p.age}</td>
                  <td className="px-3 py-3 text-center text-muted-foreground hidden md:table-cell">{p.city}</td>
                  <td className="px-3 py-3 text-center hidden sm:table-cell">{p.tournaments}</td>
                  <td className="px-4 py-3 text-right font-oswald font-bold text-lg text-tennis-green">{p.rating}</td>
                  <td className="px-3 py-3 text-center">
                    {p.rankChange > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-green-500 text-xs font-bold">
                        <Icon name="TrendingUp" size={12} />+{p.rankChange}
                      </span>
                    ) : p.rankChange < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-red-400 text-xs font-bold">
                        <Icon name="TrendingDown" size={12} />{p.rankChange}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <Icon name="SearchX" size={36} className="mx-auto mb-3 opacity-40" />
            <div>Игроки не найдены</div>
          </div>
        )}
      </div>

      {/* Points system */}
      <div className="mt-8 bg-white rounded-2xl border border-border shadow-sm p-6">
        <h3 className="font-bold text-base mb-4 flex items-center gap-2 text-tennis-green">
          <Icon name="Info" size={16} />
          Система очков
        </h3>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <Icon name="ChevronRight" size={14} className="shrink-0 mt-0.5 text-tennis-green" />
            Последнее место — 1 очко, каждое следующее +1
          </div>
          <div className="flex items-start gap-2">
            <Icon name="ChevronRight" size={14} className="shrink-0 mt-0.5 text-tennis-green" />
            Техническое поражение — 0 очков
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Star" size={14} className="shrink-0 mt-0.5 text-tennis-yellow" />
            <span><strong>Бонус +2 очка</strong> за победу над игроком из топ-5 рейтинга</span>
          </div>
        </div>
      </div>
    </div>
  );
}
