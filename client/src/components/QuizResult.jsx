import { CheckCircle2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './ui.jsx';
import { levelLabel, percent } from '../lib/format.js';

/**
 * Result and feedback.
 *
 * The score, the pass line, and the level movement are stated before any
 * generated prose, so the officer never has to infer the outcome from the tone of
 * a paragraph. Per-question review shows the explanation for every item, right or
 * wrong - that is the part that teaches.
 */
export default function QuizResult({ result, onRetake }) {
  const { scoreRatio, passed, levelBefore, levelAfter, answers = [], feedback } = result;
  const moved = levelAfter !== levelBefore;

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex gap-3">
            {passed ? (
              <CheckCircle2 size={24} aria-hidden="true" style={{ color: 'var(--status-good)' }} />
            ) : (
              <XCircle size={24} aria-hidden="true" style={{ color: 'var(--status-critical)' }} />
            )}
            <div>
              <p className="text-lg font-semibold text-ink">
                {percent(scoreRatio)} · {passed ? 'Level recorded' : 'Not recorded'}
              </p>
              <p className="mt-0.5 text-xs text-ink-2">
                {answers.filter((answer) => answer.isCorrect).length} of {answers.length} correct ·
                pass mark 70%
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="label">Competency level</p>
            <p className="tnum mt-1 text-sm text-ink">
              {levelBefore}
              {moved && (
                <>
                  {' → '}
                  <span style={{ color: 'var(--delta-up)' }}>{levelAfter}</span>
                </>
              )}
            </p>
            <p className="text-[11px] text-ink-muted">{levelLabel(levelAfter)}</p>
          </div>
        </div>
      </Card>

      {feedback && (
        <Card title="Feedback" subtitle={sourceNote(feedback.llmSource)}>
          <p className="text-sm text-ink-2">{feedback.summary}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <FeedbackList title="Held up" items={feedback.strengths} />
            <FeedbackList title="Needs work" items={feedback.focusAreas} />
          </div>

          {feedback.nextStep && (
            <p className="mt-4 border-l-2 pl-3 text-sm text-ink" style={{ borderColor: 'var(--series-1)' }}>
              {feedback.nextStep}
            </p>
          )}
        </Card>
      )}

      <Card title="Question review">
        <ol className="space-y-4">
          {answers.map((answer, index) => (
            <li key={answer.question ?? index} className="border-t border-hairline pt-4 first:border-0 first:pt-0">
              <div className="flex gap-2">
                {answer.isCorrect ? (
                  <CheckCircle2
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--status-good)' }}
                  />
                ) : (
                  <XCircle
                    size={15}
                    aria-hidden="true"
                    className="mt-0.5 shrink-0"
                    style={{ color: 'var(--status-critical)' }}
                  />
                )}
                <div>
                  <p className="text-sm text-ink">{answer.stem}</p>
                  <p className="mt-1 text-xs text-ink-2">
                    You chose: {answer.chosen ?? 'no answer'}
                  </p>
                  {!answer.isCorrect && (
                    <p className="text-xs text-ink-2">Correct: {answer.correct}</p>
                  )}
                  {answer.explanation && (
                    <p className="mt-1.5 text-xs text-ink-muted">{answer.explanation}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Link to="/path" className="btn-primary">
          Back to your path
        </Link>
        <button type="button" className="btn-quiet" onClick={onRetake}>
          {passed ? 'Attempt another competency' : 'Retake this quiz'}
        </button>
      </div>
    </div>
  );
}

function FeedbackList({ title, items = [] }) {
  if (!items.length) return null;
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-1.5 space-y-1">
        {items.map((item) => (
          <li key={item} className="text-xs text-ink-2">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function sourceNote(source) {
  if (source === 'live') return 'Written for this attempt.';
  if (source === 'cache') return 'Reused from an identical attempt this session.';
  return 'Assembled offline — no model key configured.';
}
