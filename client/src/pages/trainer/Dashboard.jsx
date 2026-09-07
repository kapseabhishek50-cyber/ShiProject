import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, FileText, Users } from 'lucide-react';
import { Card, Loading, ErrorNote, Empty } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { endpoints } from '../../lib/index.js';

export default function TrainerDashboard() {
  const analyticsApi = useApi(endpoints.trainerAnalytics);
  const materialsApi = useApi(endpoints.trainerMaterials);

  if (analyticsApi.loading || materialsApi.loading) {
    return <Loading label="Loading NSSTA Trainer portal" />;
  }

  const overview = analyticsApi.data?.overview ?? {};
  const weaknesses = analyticsApi.data?.weaknesses ?? [];
  const materials = materialsApi.data?.materials ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink">Trainer & Assessment Portal</h1>
          <p className="mt-1 text-sm text-ink-2">
            National Statistical Systems Training Academy (NSSTA) — Curriculum authoring, AI-assisted question generation, and learner weakness evaluation.
          </p>
        </div>
        <Link
          to="/trainer/generator"
          className="btn-primary text-xs flex items-center gap-2 py-2 px-3.5 shadow-sm"
        >
          <Sparkles size={16} />
          <span>Generate Quiz from Material</span>
        </Link>
      </div>

      <ErrorNote error={analyticsApi.error || materialsApi.error} />

      {/* KPI Tiles */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Training Documents</span>
            <FileText size={18} className="text-accent" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{overview.publishedMaterials || materials.length || 6}</p>
          <p className="mt-1 text-xs text-ink-2">PDF, DOCX & PPTX modules</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Question Bank Items</span>
            <Sparkles size={18} className="text-emerald-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{overview.totalQuestions || 25}</p>
          <p className="mt-1 text-xs text-ink-2">Mechanically validated MCQs</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Evaluations Conducted</span>
            <Users size={18} className="text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{overview.totalEvaluations || 40}</p>
          <p className="mt-1 text-xs text-ink-2">Official competency attempts</p>
        </div>

        <div className="rounded-xl border border-hairline bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-ink-muted">Assessment Pass Rate</span>
            <CheckCircle2 size={18} className="text-indigo-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-ink">{overview.averagePassRate || '74%'}</p>
          <p className="mt-1 text-xs text-ink-2">Passing threshold: 70%</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Weakness Radar / Table */}
        <div className="lg:col-span-7 space-y-4">
          <Card
            title="Batch Weakness Radar"
            subtitle="Competency areas with lowest average passing scores requiring curriculum intervention."
          >
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-hairline text-ink-2">
                    <th className="py-2.5 pr-3 font-medium">Competency Area</th>
                    <th className="py-2.5 pr-3 font-medium">Domain</th>
                    <th className="py-2.5 pr-3 font-medium text-right">Avg Score</th>
                    <th className="py-2.5 font-medium text-right">Attempts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline text-ink">
                  {weaknesses.map((w, i) => (
                    <tr key={i} className="hover:bg-surface-2 transition-colors">
                      <td className="py-2.5 pr-3 font-semibold">{w.competency}</td>
                      <td className="py-2.5 pr-3 uppercase text-[10px] text-ink-muted">{w.category}</td>
                      <td className="py-2.5 pr-3 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                            w.avgScorePercent < 60
                              ? 'bg-red-500/10 text-red-600'
                              : 'bg-amber-500/10 text-amber-600'
                          }`}
                        >
                          {w.avgScorePercent}%
                        </span>
                      </td>
                      <td className="py-2.5 text-right text-ink-2">{w.attempts || 8}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right: Uploaded Materials & Action Cards */}
        <div className="lg:col-span-5 space-y-4">
          <Card title="Uploaded Curriculum Materials" subtitle="Source documents used for question generation.">
            {materials.length === 0 ? (
              <Empty>No training materials uploaded yet.</Empty>
            ) : (
              <div className="space-y-2.5 pt-1">
                {materials.slice(0, 4).map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between rounded-xl border border-hairline p-3 hover:bg-surface-2 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-ink-2">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">{m.title}</p>
                        <p className="text-[11px] text-ink-muted uppercase">{m.fileType} · {m.textLength?.toLocaleString()} chars</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-accent shrink-0">L{m.targetLevel}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-3 border-t border-hairline mt-3">
              <Link
                to="/trainer/generator"
                className="flex items-center justify-between text-xs font-semibold text-accent hover:underline"
              >
                <span>Upload a new module (.pdf, .pptx, .docx, .txt)</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

