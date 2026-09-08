import { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  Play,
  Search,
  Sparkles,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import { useApi } from '../../hooks/useApi.js';
import { endpoints, formatDate } from '../../lib/index.js';
import { Badge, Card, Empty, ErrorNote, Loading, StatTile } from '../../components/ui.jsx';

export default function MyLearning() {
  const learning = useApi(endpoints.myLearning);
  const [filter, setFilter] = useState('all'); // all | in_progress | completed
  const [search, setSearch] = useState('');

  if (learning.loading) return <Loading label="Loading your courses" />;
  if (learning.error) return <ErrorNote error={learning.error} onRetry={learning.refetch} />;

  const stats = learning.data?.stats ?? { total: 0, completed: 0, inProgress: 0, totalHours: 0 };
  const enrollments = learning.data?.enrollments ?? [];

  const filtered = enrollments.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && item.status === 'completed') ||
      (filter === 'in_progress' && item.status === 'in_progress');
    const matchesSearch =
      !search ||
      item.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      item.course?.provider?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">My Courses</h1>
          <p className="mt-1 text-sm text-ink-2">
            Track your progress, access video materials, and complete certifications.
          </p>
        </div>
      </div>

      {/* ── Stat Tiles ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatTile
          label="Enrolled Courses"
          value={stats.total}
          hint="From official NSSTA & iGOT"
          icon={BookOpen}
        />
        <StatTile
          label="Completed"
          value={stats.completed}
          delta={stats.completed > 0 ? 'Certified' : null}
          icon={CheckCircle2}
        />
        <StatTile
          label="In Progress"
          value={stats.inProgress}
          hint="Active curriculum modules"
          icon={Play}
        />
        <StatTile
          label="Learning Time"
          value={`${stats.totalHours}h`}
          hint="Total contact hours logged"
          icon={Clock}
        />
      </div>

      {/* ── Filters & Search ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-b border-hairline pb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'in_progress', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-pill text-xs font-semibold capitalize transition-all ${
                filter === tab
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-2 text-ink-2 hover:text-ink'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            placeholder="Search enrolled courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-2 rounded-pill py-2 pl-10 pr-4 text-xs focus:bg-surface focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* ── Course Grid ───────────────────────────────────────────── */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div key={item._id} className="course-card group flex flex-col justify-between">
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-t-card bg-surface-3">
                  <img
                    src={
                      item.course?.imageUrl ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop'
                    }
                    alt={item.course?.title}
                    className="course-card-image h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <span
                    className={`absolute top-3 left-3 pill text-[10px] ${
                      item.status === 'completed' ? 'pill-success' : 'pill-primary'
                    }`}
                  >
                    {item.status === 'completed' ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="absolute bottom-3 right-3 text-xs font-medium text-white/90">
                    {item.course?.durationHours || 4}h duration
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                    {item.course?.provider || 'iGOT Karmayogi'}
                  </span>
                  <h3 className="text-base font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                    {item.course?.title}
                  </h3>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-xs text-ink-2 font-medium">
                      <span>Course Progress</span>
                      <span className="font-bold text-ink">{item.progressPct || 0}%</span>
                    </div>
                    <div className="progress-bar h-1.5">
                      <div
                        className={`progress-bar-fill ${
                          item.status === 'completed' ? 'bg-status-good' : 'bg-primary'
                        }`}
                        style={{ width: `${item.progressPct || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between gap-3 border-t border-hairline/50 mt-4">
                <a
                  href={item.course?.externalUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-quiet text-xs flex-1 justify-center py-2"
                >
                  <ExternalLink size={14} />
                  Launch Course
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          title="No Courses Found"
          description="Explore your personalized Learning Path to discover and enroll in new courses."
        />
      )}
    </div>
  );
}
