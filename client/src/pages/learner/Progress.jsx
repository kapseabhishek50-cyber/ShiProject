import { ArrowUpRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompetencyMeter from '../../components/CompetencyMeter.jsx';
import { Card, Empty, ErrorNote, Loading, StatTile } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { endpoints, formatDate, percent } from '../../lib/index.js';

export default function Progress() {
  const path = useApi(endpoints.recommendations);
  const competencies = useApi(endpoints.myCompetencies);
  const quizzes = useApi(endpoints.quizHistory);
  const progress = useApi(endpoints.progress);

  if (path.loading || competencies.loading || quizzes.loading || progress.loading) return <Loading label="Loading your progress" />;

  const gaps = path.data?.gaps ?? [];
  const records = competencies.data?.competencies ?? [];
  const results = quizzes.data?.results ?? [];
  const completed = progress.data?.progress?.filter((item) => item.status === 'completed').length ?? 0;
  const improvements = results.filter((result) => result.passed && result.levelAfter > result.levelBefore);
  const levelGain = improvements.reduce((sum, result) => sum + (result.levelAfter - result.levelBefore), 0);
  const error = path.error ?? competencies.error ?? quizzes.error ?? progress.error;
  const retry = path.error ? path.refetch : competencies.error ? competencies.refetch : quizzes.error ? quizzes.refetch : progress.refetch;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Progress</h1>
        <p className="mt-1 text-sm text-ink-2">See how learning activity changes your governed competency record over time.</p>
      </div>
      <ErrorNote error={error} onRetry={retry} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Levels improved" value={improvements.length} hint="Passed quizzes that raised a recorded level" />
        <StatTile label="Level points gained" value={levelGain} hint="Cumulative increase across competencies" delta={levelGain ? `${levelGain} point${levelGain === 1 ? '' : 's'} recorded` : null} />
        <StatTile label="Courses completed" value={completed} hint="Completion is tracked separately from evidence" />
        <StatTile label="Current readiness" value={percent(path.data?.readiness)} hint="Against your role requirements" />
      </div>

      <Card title="Competency progress" subtitle="A quiz pass is the event that can raise a recorded level.">
        {!records.length ? <Empty>Complete the assessment to start tracking competency progress.</Empty> : (
          <div className="space-y-4">
            {records.map((record) => {
              const gap = gaps.find((item) => item.competencyId === String(record.competency?._id ?? record.competency));
              const latest = results.find((result) => String(result.competency?._id) === String(record.competency?._id));
              return <div key={String(record.competency?._id ?? record.competency)}><CompetencyMeter name={record.competency?.name} category={record.competency?.category} currentLevel={record.currentLevel} requiredLevel={gap?.requiredLevel} /><p className="mt-1 text-[11px] text-ink-muted">{latest?.passed ? `Last improved ${formatDate(latest.submittedAt ?? latest.createdAt)} · ${latest.levelBefore} → ${latest.levelAfter}` : `Evidence: ${record.evidence ?? 'self reported'}`}</p></div>;
            })}
          </div>
        )}
      </Card>

      <Card title="Recent improvements" action={<Link to="/quiz" className="btn-quiet text-xs"><ArrowUpRight size={13} aria-hidden="true" /> Quizzes</Link>}>
        {!improvements.length ? <Empty>Pass a competency quiz to see measurable improvement here.</Empty> : (
          <div className="space-y-3">{improvements.slice(0, 8).map((result) => <div key={result._id} className="flex items-center justify-between gap-3 border-b border-hairline pb-3 last:border-0"><div><p className="text-sm font-medium text-ink">{result.competency?.name}</p><p className="text-xs text-ink-muted">{formatDate(result.submittedAt ?? result.createdAt)} · {percent(result.scoreRatio)}</p></div><p className="flex items-center gap-1 text-sm text-[var(--delta-up)]"><TrendingUp size={14} aria-hidden="true" /> {result.levelBefore} → {result.levelAfter}<CheckCircle2 size={14} aria-hidden="true" /></p></div>)}</div>
        )}
      </Card>
    </div>
  );
}
