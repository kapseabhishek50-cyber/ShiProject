import {
  ArrowRight,
  Flame,
  Zap,
  Clock,
  BookOpen,
  Sparkles,
  Play,
  TrendingUp,
  AlertCircle,
  Route as RouteIcon,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CompetencyMeter from '../../components/CompetencyMeter.jsx';
import GapBarChart from '../../components/GapBarChart.jsx';
import { Badge, Card, Empty, ErrorNote, Loading } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { endpoints, percent, formatDate } from '../../lib/index.js';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const path = useApi(endpoints.recommendations);
  const mine = useApi(endpoints.myCompetencies);
  const quizzes = useApi(endpoints.quizHistory);
  const myLearning = useApi(endpoints.myLearning);

  if (path.loading) return <Loading label="Analyzing your learning profile & gaps" />;

  const data = path.data;
  const gaps = data?.gaps ?? [];
  const openGaps = gaps.filter((row) => row.gap > 0);
  const held = mine.data?.competencies ?? [];
  const results = quizzes.data?.results ?? [];
  const passed = results.filter((result) => result.passed).length;
  const enrolledCourses = myLearning.data?.enrollments ?? [];

  if (path.error?.status === 404 || !data?.jobRole) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Welcome, {user?.name?.split(' ')[0] ?? 'Learner'} 👋</h1>
          <p className="mt-1 text-base text-ink-2">Complete your role setup to unlock personalized AI recommendations.</p>
        </div>
        <div className="card-glass border-primary/20 space-y-4">
          <h2 className="text-lg font-bold text-ink">Set up your Statistical Profile</h2>
          <p className="text-sm text-ink-2">
            Assign your department and job cadre. StatSkill AI uses these to automatically map your mandatory NSSTA competencies.
          </p>
          <Link to="/profile" className="btn btn-primary inline-flex items-center gap-2">
            Open Profile Setup <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] ?? 'Learner';

  return (
    <div className="space-y-10">
      {/* ── 1. Welcome & Headline Section ────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ink">
            Good morning, {firstName} 👋
          </h1>
          <p className="mt-1 text-base text-ink-2">
            You're making great progress. Keep your learning streak alive today.
          </p>
        </div>

        {/* Quick AI Action button */}
        <button
          onClick={() => navigate('/assistant')}
          className="btn btn-accent self-start md:self-auto shadow-glow flex items-center gap-2"
        >
          <Sparkles size={16} />
          Ask StatSkill AI
        </button>
      </div>

      <ErrorNote
        error={path.error ?? mine.error ?? quizzes.error}
        onRetry={path.error ? path.refetch : mine.error ? mine.refetch : quizzes.refetch}
      />

      {/* ── 2. Four Premium Metric Tiles ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Streak */}
        <div className="metric-tile">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Current Streak</span>
            <Flame size={20} className="text-streak streak-glow" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-ink">{user?.currentStreak ?? 7} <span className="text-lg font-normal text-ink-muted">Days</span></p>
          <p className="mt-2 text-xs font-semibold text-streak flex items-center gap-1">
            🔥 On fire! Keep learning today
          </p>
        </div>

        {/* XP */}
        <div className="metric-tile">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Experience Points</span>
            <Zap size={20} className="fill-xp text-xp" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-ink">{user?.xp ?? 2480}</p>
          <p className="mt-2 text-xs font-semibold text-primary flex items-center gap-1">
            ⚡ +120 XP earned this week
          </p>
        </div>

        {/* Learning Hours */}
        <div className="metric-tile">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Learning Hours</span>
            <Clock size={20} className="text-primary" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-ink">34.5<span className="text-lg font-normal text-ink-muted">h</span></p>
          <p className="mt-2 text-xs font-semibold text-ink-muted">
            Across 12 completed modules
          </p>
        </div>

        {/* Role Readiness */}
        <div className="metric-tile">
          <div className="flex items-center justify-between mb-3">
            <span className="label">Role Readiness</span>
            <TrendingUp size={20} className="text-status-good" />
          </div>
          <p className="text-3xl sm:text-4xl font-extrabold text-ink">{percent(data?.readiness)}</p>
          <p className="mt-2 text-xs font-semibold text-status-good flex items-center gap-1">
            <CheckCircle2 size={13} /> Target: 80%+ required
          </p>
        </div>
      </div>

      {/* ── 3. AI Learning Insight Banner ───────────────────────────── */}
      {data?.narrative?.summary && (
        <div className="card-ai p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-glow">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent animate-pulse" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-ai-gradient">
                AI Learning Insight
              </h2>
            </div>
            <p className="text-base font-medium text-ink leading-relaxed">
              "{data.narrative.summary}"
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link to="/path" className="btn btn-primary text-xs">
              View Learning Path
            </Link>
            <Link to="/assistant" className="btn btn-quiet text-xs">
              Ask AI
            </Link>
          </div>
        </div>
      )}

      {/* ── 4. Netflix-style "Continue Learning" Row ───────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ink">Continue Learning</h2>
            <p className="text-xs text-ink-muted">Pick up right where you left off</p>
          </div>
          <Link to="/my-learning" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
            View All Courses <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="course-card group">
            <div className="relative h-44 w-full overflow-hidden rounded-t-card bg-surface-3">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"
                alt="Data Analytics"
                className="course-card-image h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 pill pill-ai text-[11px]">
                In Progress
              </span>
              <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90">
                6h 30m total
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-xs font-semibold text-primary">Official Statistics</span>
                <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                  Python for Statistical Data Analysis
                </h3>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-ink-2 font-medium">
                  <span>Progress</span>
                  <span className="text-primary font-bold">72%</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill" style={{ width: '72%' }} />
                </div>
              </div>

              <Link
                to="/my-learning"
                className="btn btn-primary w-full text-xs mt-2 justify-center"
              >
                <Play size={14} className="fill-white" />
                Continue Module 4
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="course-card group">
            <div className="relative h-44 w-full overflow-hidden rounded-t-card bg-surface-3">
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop"
                alt="Survey Methodology"
                className="course-card-image h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 pill pill-primary text-[11px]">
                Core Competency
              </span>
              <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90">
                4h 15m total
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-xs font-semibold text-primary">Methodology</span>
                <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                  Sampling Design & Estimation in NSS
                </h3>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-ink-2 font-medium">
                  <span>Progress</span>
                  <span className="text-primary font-bold">45%</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill" style={{ width: '45%' }} />
                </div>
              </div>

              <Link
                to="/my-learning"
                className="btn btn-primary w-full text-xs mt-2 justify-center"
              >
                <Play size={14} className="fill-white" />
                Continue Module 2
              </Link>
            </div>
          </div>

          {/* Card 3: AI Recommended */}
          <div className="course-card group border-primary/30">
            <div className="relative h-44 w-full overflow-hidden rounded-t-card bg-surface-3">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"
                alt="Machine Learning"
                className="course-card-image h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <span className="absolute top-3 left-3 pill pill-ai text-[11px] flex items-center gap-1">
                <Sparkles size={12} /> Recommended
              </span>
              <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90">
                8h 00m total
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <span className="text-xs font-semibold text-accent">High Priority Gap</span>
                <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors">
                  AI & ML for National Accounts
                </h3>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-ink-2 font-medium">
                  <span>Skill Match</span>
                  <span className="text-accent font-bold">95% Match</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill bg-accent" style={{ width: '10%' }} />
                </div>
              </div>

              <Link
                to="/path"
                className="btn btn-accent w-full text-xs mt-2 justify-center"
              >
                Start Course
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Priority Skill Gaps & Competency Breakdown ────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 cols: Ranked High Impact Skill Gaps */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Your Top Skill Gaps</h2>
              <p className="text-xs text-ink-muted">Calculated against your official MoSPI role requirements</p>
            </div>
            <Link to="/assessment" className="btn btn-quiet text-xs">
              Re-take Assessment
            </Link>
          </div>

          <div className="space-y-3">
            {openGaps.length > 0 ? (
              openGaps.slice(0, 4).map((item, idx) => (
                <div
                  key={item.competencyId}
                  className="card p-5 hover:border-primary/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm font-bold text-ink-muted">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-ink">{item.name}</h4>
                        {item.mandatory && (
                          <span className="pill pill-danger text-[10px]">Mandatory</span>
                        )}
                      </div>
                      <p className="text-xs text-ink-muted mt-0.5">
                        Current: Level {item.currentLevel} · Required: Level {item.requiredLevel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right sm:block hidden">
                      <span className="text-xs font-bold text-critical">-{item.gap} Level Gap</span>
                      <p className="text-[11px] text-ink-muted">Priority: High</p>
                    </div>
                    <Link
                      to={`/quiz/${item.competencyId}`}
                      className="btn btn-primary text-xs shrink-0 py-2 px-3.5"
                    >
                      Improve Skill →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                title="No Open Skill Gaps"
                description="You meet or exceed all current requirements for your statistical cadre!"
              />
            )}
          </div>
        </div>

        {/* Right 5 cols: Live Competency Record Meter */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-ink">Competency Profile</h2>
              <p className="text-xs text-ink-muted">0–5 NSSTA Level Scale</p>
            </div>
            <Link to="/progress" className="text-xs font-semibold text-primary hover:underline">
              Full Analytics
            </Link>
          </div>

          <div className="card p-6 space-y-4">
            {held.length > 0 ? (
              held.slice(0, 6).map((entry) => {
                const requirement = gaps.find((row) => row.competencyId === String(entry.competency?._id));
                return (
                  <CompetencyMeter
                    key={entry.competency?._id ?? entry.competency}
                    name={entry.competency?.name}
                    category={entry.competency?.category}
                    currentLevel={entry.currentLevel}
                    requiredLevel={requirement?.requiredLevel ?? null}
                  />
                );
              })
            ) : (
              <Empty
                title="No Competency Records"
                description="Start with your initial self-assessment to populate your radar."
                action={
                  <Link to="/assessment" className="btn btn-primary text-xs">
                    Start Assessment
                  </Link>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
