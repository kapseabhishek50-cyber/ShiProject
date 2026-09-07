import { useState } from 'react';
import { Trophy, Medal, Flame, Clock, Zap, Search } from 'lucide-react';
import { Card, Loading, ErrorNote, Empty } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { endpoints } from '../../lib/index.js';

export default function Leaderboard() {
  const [search, setSearch] = useState('');
  const leaderboardApi = useApi(endpoints.gamificationLeaderboard);

  if (leaderboardApi.loading) return <Loading label="Loading statistical capacity leaderboard" />;

  const leaders = leaderboardApi.data?.leaderboard ?? [];
  const filtered = leaders.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.department.toLowerCase().includes(search.toLowerCase()) ||
      l.employeeId.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
            <Trophy size={20} />
          </span>
          <h1 className="text-xl font-semibold text-ink">Workforce Capacity Leaderboard</h1>
        </div>
        <p className="mt-1 text-sm text-ink-2">
          Recognizing verified learning hours, quiz completions, and active capacity building across MoSPI and State DES directorates.
        </p>
      </div>

      <ErrorNote error={leaderboardApi.error} onRetry={leaderboardApi.refetch} />

      {/* Top 3 Podium Cards */}
      {leaders.length >= 3 && (
        <div className="grid gap-4 sm:grid-cols-3 pt-2">
          {/* Rank 2 */}
          <div className="relative rounded-2xl border border-hairline bg-surface p-5 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-lg font-bold">
              2
            </div>
            <h4 className="mt-3 text-sm font-semibold text-ink">{leaders[1].name}</h4>
            <p className="text-xs text-ink-2 truncate">{leaders[1].department}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
              <Zap size={14} className="text-blue-500" />
              {leaders[1].xp} XP
            </div>
          </div>

          {/* Rank 1 */}
          <div className="relative rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-6 text-center shadow-md -translate-y-1">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-white text-xl font-bold shadow-sm">
              <Medal size={28} />
            </div>
            <h4 className="mt-3 text-base font-bold text-ink">{leaders[0].name}</h4>
            <p className="text-xs text-ink-2 truncate">{leaders[0].department}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500 text-white px-3.5 py-1 text-xs font-bold">
              <Zap size={14} />
              {leaders[0].xp} XP
            </div>
          </div>

          {/* Rank 3 */}
          <div className="relative rounded-2xl border border-hairline bg-surface p-5 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-700/20 text-amber-700 text-lg font-bold">
              3
            </div>
            <h4 className="mt-3 text-sm font-semibold text-ink">{leaders[2].name}</h4>
            <p className="text-xs text-ink-2 truncate">{leaders[2].department}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink">
              <Zap size={14} className="text-blue-500" />
              {leaders[2].xp} XP
            </div>
          </div>
        </div>
      )}

      {/* Standings Table */}
      <Card
        title="Official Standings"
        action={
          <div className="relative w-64">
            <Search size={14} className="absolute left-2.5 top-2.5 text-ink-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search officer or division..."
              className="field w-full pl-8 text-xs"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline text-ink-2">
                <th className="py-2.5 pr-3 font-medium">Rank</th>
                <th className="py-2.5 pr-3 font-medium">Official</th>
                <th className="py-2.5 pr-3 font-medium">Division</th>
                <th className="py-2.5 pr-3 font-medium">Job Role</th>
                <th className="py-2.5 pr-3 font-medium text-right">Streak</th>
                <th className="py-2.5 pr-3 font-medium text-right">Hours</th>
                <th className="py-2.5 font-medium text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline text-ink">
              {filtered.map((officer) => (
                <tr
                  key={officer.id}
                  className={`transition-colors ${
                    officer.isCurrentUser ? 'bg-accent/10 font-medium' : 'hover:bg-surface-2'
                  }`}
                >
                  <td className="py-2.5 pr-3 font-bold">
                    {officer.rank === 1 ? '🥇 1' : officer.rank === 2 ? '🥈 2' : officer.rank === 3 ? '🥉 3' : `#${officer.rank}`}
                  </td>
                  <td className="py-2.5 pr-3">
                    <p className="font-semibold">{officer.name}</p>
                    <p className="text-[11px] text-ink-muted">{officer.employeeId}</p>
                  </td>
                  <td className="py-2.5 pr-3 text-ink-2">{officer.department}</td>
                  <td className="py-2.5 pr-3 text-ink-2">{officer.jobRole}</td>
                  <td className="py-2.5 pr-3 text-right">
                    <span className="inline-flex items-center gap-1 font-semibold text-orange-500">
                      <Flame size={12} /> {officer.currentStreak}d
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right text-ink-2">{officer.learningHours}h</td>
                  <td className="py-2.5 text-right font-bold text-accent">{officer.xp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

