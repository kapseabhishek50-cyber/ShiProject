import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import QuizResult from '../../components/QuizResult.jsx';
import QuizRunner from '../../components/QuizRunner.jsx';
import { Badge, Card, Empty, ErrorNote, Loading } from '../../components/ui.jsx';
import { useApi, useMutation } from '../../hooks/useApi.js';
import { api, endpoints, formatDate, levelLabel, percent } from '../../lib/index.js';

/**
 * Quiz flow: pick a competency and level, answer, see the result.
 *
 * Questions are requested from the server, which serves only items that passed
 * mechanical validation - a generated question with two correct options or a
 * reference to a missing table never reaches this screen.
 */
export default function Quiz() {
  const { competencyId } = useParams();
  const navigate = useNavigate();
  const path = useApi(endpoints.recommendations);
  const history = useApi(endpoints.quizHistory);
  const [attempt, setAttempt] = useState(null);
  const [result, setResult] = useState(null);

  const start = useMutation(async ({ competency, targetLevel }) => {
    const payload = await api.post(endpoints.quizStart, { competency, targetLevel });
    setResult(null);
    setAttempt(payload);
    return payload;
  });

  const submit = useMutation(async (answers) => {
    const payload = await api.post(endpoints.quizSubmit, { attemptId: attempt.attemptId, answers });
    setResult(payload.result);
    setAttempt(null);
    path.refetch();
    history.refetch();
    return payload;
  });

  if (result) {
    return (
      <QuizResult
        result={result}
        onRetake={() => {
          setResult(null);
          navigate('/quiz');
        }}
      />
    );
  }

  if (attempt) {
    return (
      <QuizRunner
        attempt={attempt}
        onSubmit={(answers) => submit.run(answers)}
        submitting={submit.loading}
        error={submit.error}
      />
    );
  }

  if (path.loading) return <Loading label="Loading your competencies" />;

  const items = path.data?.path ?? [];
  const preselected = competencyId ? items.filter((item) => item.competencyId === competencyId) : items;
  const choices = preselected.length ? preselected : items;
  const results = history.data?.results ?? [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-ink">Competency quizzes</h1>
        <p className="mt-1 max-w-2xl text-sm text-ink-2">
          A quiz is how a level gets recorded. Clearing one at 70% replaces a self-rating with an
          assessed level and recomputes your path; falling short leaves your record unchanged.
        </p>
      </div>

      <ErrorNote error={path.error ?? start.error} onRetry={path.refetch} />

      {!choices.length && (
        <Card>
          <Empty>No competencies to test yet. Complete the self-assessment first.</Empty>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {choices.map((item) => {
          const level = Math.min(item.currentLevel + 1, item.requiredLevel);
          return (
            <Card key={item.competencyId}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-ink">{item.competency?.name}</h2>
                  <p className="mt-0.5 text-xs text-ink-muted">
                    At level {item.currentLevel}, role needs {item.requiredLevel}
                  </p>
                </div>
                <Badge band={item.band} />
              </div>

              <p className="mt-3 text-xs text-ink-2">
                Next attempt: level {level} · {levelLabel(level)}
              </p>

              <button
                type="button"
                className="btn-primary mt-3 text-xs"
                disabled={start.loading}
                onClick={() => start.run({ competency: item.competencyId, targetLevel: level })}
              >
                <GraduationCap size={14} aria-hidden="true" />
                {start.loading ? 'Preparing questions…' : `Start level ${level} quiz`}
              </button>
            </Card>
          );
        })}
      </div>

      {results.length > 0 && (
        <Card title="Past attempts">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-hairline text-ink-2">
                <th className="py-2 pr-3 font-medium">Competency</th>
                <th className="py-2 pr-3 font-medium">Level</th>
                <th className="py-2 pr-3 font-medium">Score</th>
                <th className="py-2 pr-3 font-medium">Outcome</th>
                <th className="py-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              {results.map((entry) => (
                <tr key={entry._id} className="border-b border-hairline last:border-0">
                  <td className="py-2 pr-3">{entry.competency?.name ?? '—'}</td>
                  <td className="py-2 pr-3">{entry.targetLevel}</td>
                  <td className="py-2 pr-3">{percent(entry.scoreRatio)}</td>
                  <td className="py-2 pr-3">
                    {entry.passed ? (
                      <span style={{ color: 'var(--delta-up)' }}>
                        Recorded {entry.levelBefore} → {entry.levelAfter}
                      </span>
                    ) : (
                      <span className="text-ink-2">Not recorded</span>
                    )}
                  </td>
                  <td className="py-2">{formatDate(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
