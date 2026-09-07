import { Flame, Award, Trophy, Zap, Clock, Calendar, CheckCircle2, Lock } from 'lucide-react';
import { Card, Loading, ErrorNote, Empty } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { endpoints, formatDate } from '../../lib/index.js';

export default function Streak() {
  const streakApi = useApi(endpoints.gamificationStreak);
  const badgesApi = useApi(endpoints.gamificationBadges);

  if (streakApi.loading || badgesApi.loading) {
    return <Loading label="Loading your capacity building streak" />;
  }

  const {
    currentStreak = 0,
    longestStreak = 0,
    xp = 0,
    learningHours = 0,
    heatmap = [],
  } = streakApi.data ?? {};

  const badges = badgesApi.data?.badges ?? [];

  // Generate calendar grid for the last 60 days
  const today = new Date();
  const daysGrid = [];
  const heatmapMap = new Map((heatmap || []).map((h) => [h.date, h]));

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const data = heatmapMap.get(dateStr);
    daysGrid.push({
      date: dateStr,
      count: data?.count || 0,
      xp: data?.xp || 0,
      minutes: data?.minutes || 0,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
            <Flame size={20} />
          </span>
          <h1 className="text-xl font-semibold text-ink">Learning Streak & Capacity Milestones</h1>
        </div>
        <p className="mt-1 text-sm text-ink-2">
          Consistent capacity building in India&apos;s Official Statistical System. Streaks require completing lessons, passing quizzes, or contributing to technical discussions.
        </p>
      </div>

      <ErrorNote error={streakApi.error || badgesApi.error} />

      {/* KPI Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Current Streak</span>
            <Flame size={18} className="text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">
            {currentStreak} <span className="text-sm font-normal text-ink-2">days</span>
          </p>
          <p className="mt-1 text-xs text-ink-2">🔥 Active learning streak</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Longest Streak</span>
            <Trophy size={18} className="text-amber-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">
            {longestStreak} <span className="text-sm font-normal text-ink-2">days</span>
          </p>
          <p className="mt-1 text-xs text-ink-2">Personal best streak</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Total Experience (XP)</span>
            <Zap size={18} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{xp}</p>
          <p className="mt-1 text-xs text-ink-2">+25 per quiz, +40 high score</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Learning Hours</span>
            <Clock size={18} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">
            {learningHours} <span className="text-sm font-normal text-ink-2">hrs</span>
          </p>
          <p className="mt-1 text-xs text-ink-2">Dedicated training time</p>
        </div>
      </div>

      {/* Activity Heatmap Grid */}
      <Card title="Activity Calendar" subtitle="60-day visual learning log. Bare logins do not count; verified tasks only.">
        <div className="pt-2">
          <div className="flex flex-wrap gap-1.5">
            {daysGrid.map((day) => {
              const active = day.count > 0;
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} activity (${day.xp} XP earned)`}
                  className={`h-4 w-4 rounded-sm transition-all hover:scale-125 ${
                    day.count >= 2
                      ? 'bg-emerald-600 dark:bg-emerald-500'
                      : day.count === 1
                      ? 'bg-emerald-400 dark:bg-emerald-700'
                      : 'bg-surface-2 border border-hairline'
                  }`}
                />
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
            <span>60 days ago</span>
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              <span className="h-3 w-3 rounded-sm bg-surface-2 border border-hairline" />
              <span className="h-3 w-3 rounded-sm bg-emerald-400" />
              <span className="h-3 w-3 rounded-sm bg-emerald-600" />
              <span>More</span>
            </div>
            <span>Today</span>
          </div>
        </div>
      </Card>

      {/* Badges Showroom */}
      <Card title="Capacity Building Badges" subtitle="Recognized statistical training achievements and governance milestones">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {badges.map((b) => (
            <div
              key={b.badgeId}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-all ${
                b.unlocked
                  ? 'border-hairline bg-surface shadow-sm'
                  : 'border-dashed border-hairline bg-surface-2/40 opacity-60'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  b.unlocked
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'bg-surface-2 text-ink-muted'
                }`}
              >
                {b.unlocked ? <Award size={20} /> : <Lock size={18} />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-ink">{b.title}</h4>
                  {b.unlocked && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={10} /> Unlocked
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-ink-2 leading-relaxed">{b.description}</p>
                {b.unlocked && b.awardedAt && (
                  <p className="mt-2 text-[10px] text-ink-muted">Earned on {formatDate(b.awardedAt)}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

