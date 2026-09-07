import { BookOpen, CheckCircle2, ExternalLink, GraduationCap, RefreshCw, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompetencyMeter from '../../components/CompetencyMeter.jsx';
import { Badge, Card, Empty, ErrorNote, Loading } from '../../components/ui.jsx';
import { useApi, useMutation } from '../../hooks/useApi.js';
import { api, endpoints, percent } from '../../lib/index.js';

/**
 * The learning path, in the order the gap engine produced.
 *
 * Every row shows its own arithmetic - the gap, the context score, the resulting
 * priority - because a ranked list with no visible reason is indistinguishable
 * from an arbitrary one. The narrative explains the ordering; it does not decide
 * it, and the source tag says whether the wording was generated or templated.
 */
export default function LearningPath() {
  const path = useApi(endpoints.recommendations);
  const progress = useApi(endpoints.progress);

  const recompute = useMutation(async () => {
    const result = await api.post(endpoints.recomputePath);
    path.setData(result);
    return result;
  });

  const enroll = useMutation(async (course) => {
    await api.post(endpoints.enroll, { course });
    return progress.refetch();
  });

  if (path.loading || progress.loading) return <Loading label="Loading your learning path" />;

  const data = path.data;
  const items = data?.path ?? [];
  const enrolled = new Set((progress.data?.progress ?? []).map((entry) => String(entry.course?._id ?? entry.course)));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-ink">Your learning path</h1>
          <p className="mt-1 text-sm text-ink-2">
            {items.length} competenc{items.length === 1 ? 'y' : 'ies'} in priority order for{' '}
            {data?.jobRole?.title ?? 'your role'}.
          </p>
        </div>
        <button
          type="button"
          className="btn-quiet"
          onClick={() => recompute.run()}
          disabled={recompute.loading}
        >
          <RefreshCw size={15} aria-hidden="true" className={recompute.loading ? 'animate-spin' : ''} />
          {recompute.loading ? 'Recomputing…' : 'Recompute'}
        </button>
      </div>

      <ErrorNote error={path.error ?? progress.error ?? recompute.error ?? enroll.error} onRetry={path.error ? path.refetch : progress.refetch} />

      {data?.narrative && (
        <Card title="Why this order" subtitle={sourceNote(data.narrative.llmSource ?? data.llmSource)}>
          <p className="text-sm text-ink-2">{data.narrative.summary}</p>
          {data.narrative.reasoning?.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {data.narrative.reasoning.map((line) => (
                <li key={line} className="flex gap-2 text-xs text-ink-2">
                  <span aria-hidden="true" className="text-ink-muted">
                    —
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {!items.length && (
        <Card>
          <Empty>
            No path yet. Complete the <Link to="/assessment" className="underline">self-assessment</Link>{' '}
            so your current levels are on record.
          </Empty>
        </Card>
      )}

      <ol className="space-y-4">
        {items.map((item, index) => (
          <li key={item.competencyId}>
            <Card>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span
                    className="tnum mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-hairline text-xs text-ink-2"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-ink">{item.competency?.name}</h2>
                    <p className="mt-0.5 text-xs text-ink-muted">{item.explanation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.mandatory && <Badge band="critical">Mandatory</Badge>}
                  <Badge band={item.band} />
                </div>
              </div>

              <div className="mt-4 max-w-md">
                <CompetencyMeter
                  name={`Level ${item.currentLevel} now, ${item.requiredLevel} required`}
                  currentLevel={item.currentLevel}
                  requiredLevel={item.requiredLevel}
                  compact
                />
              </div>

              <div className="mt-4 space-y-2">
                <p className="label">Matched courses</p>
                {!item.courses?.length && (
                  <p className="text-xs text-ink-muted">
                    No catalogue course covers this level yet — flagged for the training division.
                  </p>
                )}
                {item.courses?.map(({ course, courseDetail, matchScore, reason }) => {
                  const id = String(courseDetail?._id ?? course);
                  const isEnrolled = enrolled.has(id);
                  return (
                    <div
                      key={id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-hairline p-3"
                    >
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm text-ink">
                          <BookOpen size={14} aria-hidden="true" className="shrink-0 text-ink-muted" />
                          {courseDetail?.title ?? 'Course'}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-muted">
                          {courseDetail?.provider}
                          {courseDetail?.durationHours ? ` · ${courseDetail.durationHours} h` : ''}
                          {courseDetail?.rating ? (
                            <span className="ml-1 inline-flex items-center gap-0.5">
                              <Star size={11} aria-hidden="true" />
                              {courseDetail.rating.toFixed(1)}
                            </span>
                          ) : null}
                          {' · match '}
                          {matchScore}
                        </p>
                        <p className="mt-1 text-xs text-ink-2">{reason}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {courseDetail?.url && (
                          <a
                            href={courseDetail.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="btn-quiet text-xs"
                          >
                            <ExternalLink size={13} aria-hidden="true" />
                            Open
                          </a>
                        )}
                        <button
                          type="button"
                          className="btn-quiet text-xs"
                          disabled={isEnrolled || enroll.loading}
                          onClick={() => enroll.run(id)}
                        >
                          {isEnrolled ? (
                            <>
                              <CheckCircle2 size={13} aria-hidden="true" style={{ color: 'var(--status-good)' }} />
                              Enrolled
                            </>
                          ) : (
                            'Enrol'
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 border-t border-hairline pt-3">
                <Link to={`/quiz/${item.competencyId}`} className="btn-primary text-xs">
                  <GraduationCap size={14} aria-hidden="true" />
                  Take the level {Math.min(item.currentLevel + 1, item.requiredLevel)} quiz
                </Link>
                <p className="mt-1.5 text-[11px] text-ink-muted">
                  Clearing it at 70% records the level and recomputes this path.
                </p>
              </div>
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}

function sourceNote(source) {
  if (source === 'live') return 'Explanation generated for your record.';
  if (source === 'cache') return 'Explanation reused from this session.';
  return 'Explanation assembled offline — no model key configured.';
}
