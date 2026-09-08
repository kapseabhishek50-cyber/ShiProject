import {
  Flame,
  Zap,
  Award,
  Lock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Trophy,
  Star,
  Target
} from 'lucide-react';
import { Card, Loading } from '../../components/ui.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Streak() {
  const { user } = useAuth();

  const currentStreak = user?.currentStreak ?? 7;
  const longestStreak = 21;
  const xp = user?.xp ?? 2480;
  const totalDays = 87;

  // 60-day activity simulation
  const days = Array.from({ length: 60 }).map((_, i) => {
    // Recent 7 days active, scattered activity before
    const isActive = i > 52 || (i % 3 === 0) || (i % 7 === 2);
    return { day: i + 1, active: isActive };
  });

  const badges = [
    {
      id: 'b1',
      title: 'First Assessment',
      desc: 'Completed initial competency evaluation',
      unlocked: true,
      icon: Target,
    },
    {
      id: 'b2',
      title: '7-Day Streak',
      desc: 'Maintained 7 consecutive days of active learning',
      unlocked: true,
      icon: Flame,
    },
    {
      id: 'b3',
      title: 'Quiz Master',
      desc: 'Scored 100% on 3 consecutive competency quizzes',
      unlocked: true,
      icon: Award,
    },
    {
      id: 'b4',
      title: 'Course Explorer',
      desc: 'Enrolled in 5+ official NSSTA training modules',
      unlocked: true,
      icon: Star,
    },
    {
      id: 'b5',
      title: 'Skill Improver',
      desc: 'Upgraded 3 competencies to Level 3 or higher',
      unlocked: false,
      req: 'Upgrade 1 more competency',
      icon: Zap,
    },
    {
      id: 'b6',
      title: '30-Day Champion',
      desc: 'Complete a full month of continuous capacity building',
      unlocked: false,
      req: '23 days remaining',
      icon: Trophy,
    },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">
          Streaks & Gamification
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          Daily consistency rewards, learning momentum, and career milestone badges.
        </p>
      </div>

      {/* ── Main Streak Banner ─────────────────────────────────────── */}
      <div className="card-ai p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-card-premium">
        <div className="flex items-center gap-6">
          <div className="grid h-24 w-24 place-items-center rounded-2xl bg-surface/80 border border-hairline shadow-glow">
            <Flame size={48} className="text-streak streak-glow animate-bounce" />
          </div>

          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <h2 className="text-4xl font-extrabold text-ink">{currentStreak} Days</h2>
              <span className="pill pill-warning text-xs">Active Streak</span>
            </div>
            <p className="text-sm font-medium text-ink-2">
              You're on fire! Complete a quick quiz or module today to keep the flame burning.
            </p>
          </div>
        </div>

        {/* Weekly Day Indicators */}
        <div className="flex items-center gap-2 bg-surface/60 p-3 rounded-card border border-hairline">
          {weekDays.map((d, idx) => (
            <div key={d} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] font-semibold text-ink-muted">{d}</span>
              <div
                className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold transition-all ${
                  idx < 5
                    ? 'bg-gradient-accent text-white shadow-xs'
                    : 'bg-surface-2 text-ink-muted border border-hairline'
                }`}
              >
                {idx < 5 ? <CheckCircle2 size={16} /> : '•'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stat Overview ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="metric-tile">
          <span className="label">Current Streak</span>
          <p className="text-3xl font-bold text-ink mt-2">{currentStreak} Days</p>
          <p className="text-xs text-streak mt-1">Personal Best: 21 Days</p>
        </div>
        <div className="metric-tile">
          <span className="label">Longest Streak</span>
          <p className="text-3xl font-bold text-ink mt-2">{longestStreak} Days</p>
          <p className="text-xs text-ink-muted mt-1">Set in Aug 2026</p>
        </div>
        <div className="metric-tile">
          <span className="label">Total XP</span>
          <p className="text-3xl font-bold text-ink mt-2">{xp}</p>
          <p className="text-xs text-primary mt-1">Rank: Top 5% in Cadre</p>
        </div>
        <div className="metric-tile">
          <span className="label">Active Days</span>
          <p className="text-3xl font-bold text-ink mt-2">{totalDays}</p>
          <p className="text-xs text-status-good mt-1">82% Consistency</p>
        </div>
      </div>

      {/* ── 60-Day Activity Heatmap ─────────────────────────────────── */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-ink">60-Day Activity Map</h3>
            <p className="text-xs text-ink-muted">Visual record of daily learning activity</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            <span>Less</span>
            <div className="w-3 h-3 rounded bg-surface-2" />
            <div className="w-3 h-3 rounded bg-primary/40" />
            <div className="w-3 h-3 rounded bg-primary" />
            <span>More</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {days.map((d) => (
            <div
              key={d.day}
              title={`Day ${d.day}: ${d.active ? 'Activity recorded' : 'No activity'}`}
              className={`h-6 w-6 rounded-md transition-all hover:scale-125 cursor-pointer ${
                d.active
                  ? 'bg-primary shadow-xs'
                  : 'bg-surface-2 border border-hairline/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Badges & Achievements Grid ──────────────────────────────── */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-ink">Earned Badges & Milestones</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`card p-6 flex items-start gap-4 transition-all ${
                  b.unlocked
                    ? 'border-primary/30 shadow-card-hover'
                    : 'opacity-60 bg-surface-2/40'
                }`}
              >
                <div
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${
                    b.unlocked
                      ? 'bg-gradient-accent text-white shadow-glow'
                      : 'bg-surface-3 text-ink-muted'
                  }`}
                >
                  {b.unlocked ? <Icon size={24} /> : <Lock size={20} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-ink">{b.title}</h4>
                    {b.unlocked ? (
                      <span className="pill pill-success text-[10px]">Unlocked</span>
                    ) : (
                      <span className="pill pill-neutral text-[10px]">Locked</span>
                    )}
                  </div>
                  <p className="text-xs text-ink-2 leading-relaxed">{b.desc}</p>
                  {!b.unlocked && b.req && (
                    <p className="text-[11px] font-semibold text-accent pt-1">
                      Requirement: {b.req}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
