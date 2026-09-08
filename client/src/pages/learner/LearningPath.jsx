import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Lock,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import CompetencyMeter from '../../components/CompetencyMeter.jsx';
import { Badge, Card, Empty, ErrorNote, Loading } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { api, endpoints, levelLabel } from '../../lib/index.js';

export default function LearningPath() {
  const path = useApi(endpoints.recommendations);
  const [recomputing, setRecomputing] = useState(false);

  if (path.loading) return <Loading label="Calculating optimal learning roadmap" />;
  if (path.error) return <ErrorNote error={path.error} onRetry={path.refetch} />;

  const data = path.data;
  const items = data?.path ?? [];

  async function handleRecompute() {
    setRecomputing(true);
    try {
      await api.post(endpoints.recomputeRecommendations, {});
      await path.refetch();
    } catch (err) {
      console.error('Failed to recompute path:', err);
    } finally {
      setRecomputing(false);
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Personalized Learning Path
          </h1>
          <p className="mt-1 text-sm text-ink-2">
            AI-sequenced curriculum based on your largest priority skill gaps.
          </p>
        </div>

        <button
          onClick={handleRecompute}
          disabled={recomputing}
          className="btn btn-accent text-xs flex items-center gap-2 self-start sm:self-auto shadow-glow"
        >
          <Sparkles size={15} />
          {recomputing ? 'Recalculating...' : 'Recompute with AI'}
        </button>
      </div>

      {/* ── AI Narrative Explanation Card ──────────────────────────── */}
      {data?.narrative && (
        <div className="card-ai p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-accent" />
            <h2 className="text-sm font-bold tracking-wider text-ai-gradient uppercase">
              Curriculum Sequence Strategy
            </h2>
          </div>
          <p className="text-sm font-medium text-ink leading-relaxed">
            {data.narrative.summary}
          </p>
          {data.narrative.factors?.length > 0 && (
            <div className="pt-2 flex flex-wrap gap-2">
              {data.narrative.factors.map((f, i) => (
                <span key={i} className="pill pill-neutral text-[11px]">
                  ✓ {f}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Visual Roadmap Timeline ─────────────────────────────────── */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-ink">Curriculum Sequence</h2>

        <div className="space-y-4">
          {items.map((item, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={item.competencyId}
                className={`card p-6 transition-all relative overflow-hidden ${
                  isFirst ? 'border-primary shadow-card-hover ring-2 ring-primary/10' : ''
                }`}
              >
                {isFirst && (
                  <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    Next Focus Step
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  {/* Step Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-bold text-sm ${
                        isFirst
                          ? 'bg-gradient-accent text-white shadow-glow'
                          : 'bg-surface-2 text-ink-muted'
                      }`}
                    >
                      0{index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-ink">
                          {item.competency?.name}
                        </h3>
                        <Badge band={item.band} />
                      </div>
                      <p className="text-xs text-ink-2 max-w-xl leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Meter & Quick Actions */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
                    <div className="w-44">
                      <CompetencyMeter
                        name="Target Level"
                        currentLevel={item.currentLevel}
                        requiredLevel={item.requiredLevel}
                        compact
                      />
                    </div>

                    <Link
                      to={`/quiz/${item.competencyId}`}
                      className="btn btn-primary text-xs shrink-0 py-2.5 px-4"
                    >
                      <GraduationCap size={15} />
                      Take Quiz
                    </Link>
                  </div>
                </div>

                {/* Associated Courses List */}
                {item.courses?.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-hairline/60">
                    <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-3">
                      Recommended Course Materials
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.courses.map((c, cIdx) => (
                        <a
                          key={cIdx}
                          href={c.courseDetail?.externalUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 rounded-button bg-surface-2 hover:bg-surface-3 transition-colors text-xs font-medium text-ink"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <BookOpen size={14} className="text-primary shrink-0" />
                            <span className="truncate">{c.courseDetail?.title}</span>
                          </span>
                          <ExternalLink size={12} className="text-ink-muted shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <Empty
              title="No Learning Path Found"
              description="Complete your initial assessment so AI can chart your personal upskilling roadmap."
            />
          )}
        </div>
      </div>
    </div>
  );
}
