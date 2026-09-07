import { useState } from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { Card, ErrorNote } from './ui.jsx';
import { levelLabel } from '../lib/format.js';

/**
 * One question at a time.
 *
 * The options arrive without their correctness - the API withholds it until the
 * attempt is submitted, so the answer key is never in the page. Navigation is
 * free in both directions and nothing is scored client-side.
 */
export default function QuizRunner({ attempt, onSubmit, submitting, error }) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState({});

  const questions = attempt.questions ?? [];
  const question = questions[index];
  const answeredCount = Object.keys(chosen).length;
  const isLast = index === questions.length - 1;

  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-ink">{attempt.competency?.name}</h1>
          <p className="mt-0.5 text-xs text-ink-2">
            Level {attempt.targetLevel} · {levelLabel(attempt.targetLevel)} · 70% to record the level
          </p>
        </div>
        <p className="tnum text-xs text-ink-2">
          Question {index + 1} of {questions.length}
        </p>
      </div>

      {/* Progress is a single thin bar, not a chart - no axis, no legend. */}
      <div className="h-1.5 w-full rounded-sm bg-surface-2" role="presentation">
        <div
          className="h-full rounded-r-[4px]"
          style={{
            width: `${(answeredCount / questions.length) * 100}%`,
            background: 'var(--series-1)',
          }}
        />
      </div>

      <Card>
        <p className="text-sm text-ink">{question.stem}</p>

        <fieldset className="mt-4 space-y-2">
          <legend className="sr-only">Select one answer</legend>
          {question.options.map((option, optionIndex) => {
            const optionId = String(option._id ?? optionIndex);
            const selected = chosen[question._id] === optionId;
            return (
              <label
                key={optionId}
                className={`flex cursor-pointer gap-3 rounded-md border p-3 text-sm transition-colors ${
                  selected ? 'border-transparent bg-surface-2 text-ink' : 'border-hairline text-ink-2 hover:bg-surface-2'
                }`}
                style={selected ? { boxShadow: 'inset 2px 0 0 var(--series-1)' } : undefined}
              >
                <input
                  type="radio"
                  name={question._id}
                  className="sr-only"
                  checked={selected}
                  onChange={() => setChosen({ ...chosen, [question._id]: optionId })}
                />
                <span className="tnum shrink-0 text-ink-muted" aria-hidden="true">
                  {String.fromCharCode(65 + optionIndex)}
                </span>
                {option.text}
              </label>
            );
          })}
        </fieldset>
      </Card>

      <ErrorNote error={error} />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="btn-quiet"
          disabled={index === 0}
          onClick={() => setIndex((current) => current - 1)}
        >
          <ChevronLeft size={15} aria-hidden="true" />
          Previous
        </button>

        {isLast ? (
          <button
            type="button"
            className="btn-primary"
            disabled={answeredCount < questions.length || submitting}
            onClick={() =>
              onSubmit(
                questions.map((item) => ({ question: item._id, option: chosen[item._id] ?? null })),
              )
            }
          >
            <Send size={15} aria-hidden="true" />
            {submitting ? 'Scoring…' : 'Submit answers'}
          </button>
        ) : (
          <button type="button" className="btn-primary" onClick={() => setIndex((current) => current + 1)}>
            Next
            <ChevronRight size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {isLast && answeredCount < questions.length && (
        <p className="text-center text-xs text-ink-muted">
          {questions.length - answeredCount} question
          {questions.length - answeredCount === 1 ? '' : 's'} still unanswered.
        </p>
      )}
    </div>
  );
}
