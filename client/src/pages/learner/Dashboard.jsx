import { ArrowRight, Route as RouteIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import CompetencyMeter from '../../components/CompetencyMeter.jsx';
import GapBarChart from '../../components/GapBarChart.jsx';
import { Badge, Card, Empty, ErrorNote, Loading, StatTile } from '../../components/ui.jsx';
import { useApi } from '../../hooks/useApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { endpoints, percent, formatDate } from '../../lib/index.js';

export default function Dashboard() {
  const { user } = useAuth();
  const path = useApi(endpoints.recommendations);
  const mine = useApi(endpoints.myCompetencies);
  const quizzes = useApi(endpoints.quizHistory);

  if (path.loading) return <Loading label="Computing your competency gaps" />;

  const data = path.data;
  const gaps = data?.gaps ?? [];
  const openGaps = gaps.filter((row) => row.gap > 0);
  const held = mine.data?.competencies ?? [];
  const results = quizzes.data?.results ?? [];
  const passed = results.filter((result) => result.passed).length;

  if (path.error?.status === 404 || !data?.jobRole) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-semibold text-ink">Welcome, {user?.name?.split(' ')[0] ?? 'learner'}</h1>
          <p className="mt-1 text-sm text-ink-2">Complete your role setup before we calculate your competency gaps.</p>
        </div>
        <Card title="Set up your learning dashboard">
          <p className="text-sm text-ink-2">Your account needs a department and job role. These determine the competencies, priority gaps, and courses shown here.</p>
          <Link to="/profile" className="btn-primary mt-4">Open profile setup <ArrowRight size={15} aria-hidden="true" /></Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">
          {user?.name?.split(' ')[0] ? `Good to see you, ${user.name.split(' ')[0]}` : 'Your dashboard'}
        </h1>
        <p className="mt-1 text-sm text-ink-2">
          {data?.jobRole?.title ?? 'Role not set'}
          {data?.department?.name ? ` · ${data.department.name}` : ''}
        </p>
      </div>

      <ErrorNote error={path.error ?? mine.error ?? quizzes.error} onRetry={path.error ? path.refetch : mine.error ? mine.refetch : quizzes.refetch} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Role readiness"
          value={percent(data?.readiness)}
          hint="Share of your role’s requirements met, weighted by how central each is."
        />
        <StatTile
          label="Open gaps"
          value={openGaps.length}
          hint={`${openGaps.filter((row) => row.mandatory).length} mandatory`}
        />
        <StatTile
          label="Competencies recorded"
          value={held.length}
          hint={held.length ? `Last updated ${formatDate(held[0]?.updatedAt)}` : 'Start with the assessment'}
        />
        <StatTile
          label="Quizzes cleared"
          value={passed}
          hint={results.length ? `${results.length} attempted` : 'No attempts yet'}
          delta={passed > 0 ? `${passed} level${passed === 1 ? '' : 's'} recorded` : null}
        />
      </div>

      {openGaps.length > 0 ? (
        <GapBarChart
          rows={openGaps.slice(0, 8)}
          title="Priority gaps"
          subtitle="Gap × (role importance, division priority, future demand). Higher means it costs you more at work."
          height={Math.max(220, openGaps.slice(0, 8).length * 34 + 60)}
        />
      ) : (
        <Card title="Priority gaps">
          <Empty>
            No open gaps against your current role. Complete the assessment if your record looks
            incomplete.
          </Empty>
        </Card>
      )}

      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <Card
          title="Next in your path"
          subtitle={data?.narrative?.summary ? undefined : 'Ordered by priority'}
          action={
            <Link to="/path" className="btn-quiet text-xs">
              <RouteIcon size={13} aria-hidden="true" />
              Full path
            </Link>
          }
        >
          {data?.narrative?.summary && (
            <p className="mb-4 border-l-2 pl-3 text-sm text-ink-2" style={{ borderColor: 'var(--series-1)' }}>
              {data.narrative.summary}
            </p>
          )}

          {(data?.path ?? []).slice(0, 3).map((item) => (
            <div key={item.competencyId} className="border-t border-hairline py-3 first:border-0 first:pt-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{item.competency?.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{item.explanation}</p>
                </div>
                <Badge band={item.band} />
              </div>

              {item.courses?.[0] && (
                <Link
                  to="/path"
                  className="mt-2 flex items-center gap-1.5 text-xs text-ink-2 hover:text-ink"
                >
                  <ArrowRight size={13} aria-hidden="true" />
                  {item.courses[0].courseDetail?.title}
                </Link>
              )}
            </div>
          ))}

          {!data?.path?.length && <Empty>Your path appears once your competency record exists.</Empty>}
        </Card>

        <Card title="Your competency record" subtitle="Current level against the requirement for your role">
          {mine.loading && <Loading />}
          {!mine.loading && !held.length && <Empty>Nothing recorded yet.</Empty>}
          <div className="space-y-3">
            {held.slice(0, 8).map((entry) => {
              const requirement = gaps.find((row) => row.competencyId === String(entry.competency?._id));
              return (
                <CompetencyMeter
                  key={entry.competency?._id ?? entry.competency}
                  name={entry.competency?.name}
                  category={entry.competency?.category}
                  currentLevel={entry.currentLevel}
                  requiredLevel={requirement?.requiredLevel ?? null}
                  compact
                />
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
