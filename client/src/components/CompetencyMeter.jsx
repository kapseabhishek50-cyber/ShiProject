import { MAX_LEVEL, levelLabel } from '../lib/format.js';

/**
 * One competency, one row: a thin bar for the level the officer holds, and a
 * marker for the level the role requires.
 *
 * Current and required are not two series - required is a target, so it gets a
 * reference marker rather than a second colour. That keeps the row to one hue and
 * removes the "which bar is which" question entirely. The value is direct-labelled
 * because a 0-5 bar is too short for an axis to be worth its space.
 */
export default function CompetencyMeter({
  name,
  currentLevel = 0,
  requiredLevel = null,
  category,
  compact = false,
}) {
  const currentPct = (Math.max(0, currentLevel) / MAX_LEVEL) * 100;
  const requiredPct = requiredLevel === null ? null : (requiredLevel / MAX_LEVEL) * 100;
  const met = requiredLevel === null || currentLevel >= requiredLevel;

  const description = requiredLevel === null
    ? `${name}: level ${currentLevel}, ${levelLabel(currentLevel)}`
    : `${name}: level ${currentLevel} of a required ${requiredLevel}`;

  return (
    <div className="group" title={description}>
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <p className={`truncate text-ink ${compact ? 'text-xs' : 'text-sm'}`}>{name}</p>
        <p className="tnum shrink-0 text-xs text-ink-2">
          {currentLevel}
          {requiredLevel !== null && <span className="text-ink-muted"> / {requiredLevel}</span>}
        </p>
      </div>

      {/* Track is a surface, not a series colour, so the fill is the only mark. */}
      <div
        className="relative h-2 w-full rounded-sm bg-surface-2"
        role="img"
        aria-label={description}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-r-[4px] transition-[width]"
          style={{
            width: `${currentPct}%`,
            background: 'var(--series-1)',
            // 2px surface gap keeps the fill from touching the target marker.
            boxShadow: '0 0 0 2px var(--surface-1)',
          }}
        />
        {requiredPct !== null && (
          <span
            className="absolute inset-y-[-3px] w-[2px]"
            style={{ left: `calc(${requiredPct}% - 1px)`, background: 'var(--baseline)' }}
            aria-hidden="true"
          />
        )}
      </div>

      {!compact && (
        <p className="mt-1 text-[11px] text-ink-muted">
          {levelLabel(currentLevel)}
          {category ? ` · ${category}` : ''}
          {requiredLevel !== null && !met ? ` · needs ${levelLabel(requiredLevel)}` : ''}
        </p>
      )}
    </div>
  );
}
