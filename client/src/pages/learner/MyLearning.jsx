import { BookOpen, CheckCircle2, Clock, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, Card, Empty, ErrorNote, Loading, StatTile } from '../../components/ui.jsx';
import { useApi, useMutation } from '../../hooks/useApi.js';
import { api, endpoints, formatDate } from '../../lib/index.js';

export default function MyLearning() {
  const progressData = useApi(endpoints.progress);

  const completeCourse = useMutation(async (courseId) => {
    await api.post(endpoints.complete, { course: courseId });
    return progressData.refetch();
  });

  if (progressData.loading) return <Loading label="Loading your courses" />;

  const items = progressData.data?.progress ?? [];
  const totalEnrolled = items.length;
  const completedCount = items.filter(i => i.status === 'completed').length;
  const inProgressCount = items.filter(i => i.status === 'in_progress').length;
  
  const totalMinutes = items.reduce((sum, item) => sum + (item.timeSpentMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">My courses</h1>
        <p className="mt-1 text-sm text-ink-2">
          Track your enrolled courses. Remember, completing a course here does not raise your competency level — you must clear the quiz.
        </p>
      </div>

      <ErrorNote error={progressData.error ?? completeCourse.error} onRetry={progressData.refetch} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile
          label="Total enrolled"
          value={totalEnrolled}
        />
        <StatTile
          label="Completed"
          value={completedCount}
        />
        <StatTile
          label="In progress"
          value={inProgressCount}
        />
        <StatTile
          label="Total hours spent"
          value={totalHours > 0 ? totalHours : '0'}
        />
      </div>

      {!items.length ? (
        <Card>
          <Empty>
            No courses yet. Visit your <Link to="/path" className="underline">learning path</Link> to enrol in recommended courses.
          </Empty>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const courseDetail = item.course;
            if (!courseDetail) return null;

            return (
              <Card key={String(courseDetail._id ?? courseDetail)}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <BookOpen size={16} aria-hidden="true" className="shrink-0 text-ink-muted" />
                      {courseDetail.title ?? 'Course'}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {courseDetail.provider}
                      {courseDetail.modality ? ` · ${courseDetail.modality}` : ''}
                      {courseDetail.durationHours ? ` · ${courseDetail.durationHours} h` : ''}
                    </p>
                    <div className="mt-2 flex items-center gap-4 text-[11px] text-ink-muted">
                      {item.startedAt && <span>Started: {formatDate(item.startedAt)}</span>}
                      {item.completedAt && <span>Completed: {formatDate(item.completedAt)}</span>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {item.status === 'not_started' && <Badge>Not started</Badge>}
                    {item.status === 'in_progress' && <Badge band="moderate">In progress</Badge>}
                    {item.status === 'completed' && <Badge band="low">Completed</Badge>}
                  </div>
                </div>

                <div className="mt-4 max-w-md">
                  <div className="mb-1 flex justify-between text-[11px] text-ink-muted">
                    <span>Progress</span>
                    <span>{item.percentComplete ?? 0}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${item.percentComplete ?? 0}%`,
                        backgroundColor: 'var(--series-1)' 
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {courseDetail.url && (
                    <a
                      href={courseDetail.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="btn-quiet text-xs"
                    >
                      <ExternalLink size={13} aria-hidden="true" />
                      Open course
                    </a>
                  )}
                  {item.status === 'in_progress' && (
                    <button
                      type="button"
                      className="btn-primary text-xs"
                      disabled={completeCourse.loading}
                      onClick={() => completeCourse.run(String(courseDetail._id ?? courseDetail))}
                    >
                      <CheckCircle2 size={13} aria-hidden="true" />
                      Mark complete
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
