import { AlertCircle, AlertTriangle, CheckCircle2, CircleDot, Loader2, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bandMeta } from '../lib/format.js';

/**
 * Interface primitives. Two rules from the visual spec are enforced here rather
 * than left to each page: a status colour never appears without an icon and a
 * word, and a number never wears a series colour - values stay in text ink and a
 * coloured mark sits beside them.
 */

export function Card({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="mt-0.5 text-xs text-ink-2">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/** A single headline figure. No plot, so no hover layer - this is the one form
 *  the interaction rule exempts. */
export function StatTile({ label, value, hint, delta }) {
  return (
    <div className="card">
      <p className="label">{label}</p>
      <p className="mt-2 text-3xl font-semibold leading-none text-ink">{value}</p>
      {delta && (
        <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'var(--delta-up)' }}>
          <CheckCircle2 size={14} aria-hidden="true" />
          {delta}
        </p>
      )}
      {hint && <p className="mt-2 text-xs text-ink-2">{hint}</p>}
    </div>
  );
}

const STATUS_ICON = {
  good: CheckCircle2,
  warning: AlertTriangle,
  serious: AlertCircle,
  critical: AlertCircle,
};

/** Status colour + icon + label, always all three. */
export function Badge({ band, children }) {
  const meta = bandMeta(band);
  const Icon = STATUS_ICON[meta.role] ?? CircleDot;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-hairline px-2 py-0.5 text-xs font-medium text-ink"
      title={`${meta.label} priority`}
    >
      <Icon size={13} aria-hidden="true" style={{ color: `var(--status-${meta.role})` }} />
      {children ?? meta.label}
    </span>
  );
}

export function Loading({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-2 py-8 text-sm text-ink-2" role="status">
      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      {label}…
    </div>
  );
}

export function ErrorNote({ error, onRetry }) {
  if (!error) return null;
  return (
    <div
      className="flex items-start gap-2 rounded-md border border-hairline bg-surface-2 p-3 text-sm text-ink"
      role="alert"
    >
      <AlertCircle size={16} aria-hidden="true" style={{ color: 'var(--status-critical)' }} />
      <div>
        <p>{error.message ?? String(error)}</p>
        {onRetry && (
          <button type="button" className="mt-2 text-xs underline" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </div>
  );
}

export function Empty({ children }) {
  return <p className="py-8 text-center text-sm text-ink-2">{children}</p>;
}

/**
 * Theme toggle. Stamps data-theme on <html>, which the palette's dark scope reads
 * and which beats the OS setting in both directions.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('statskill.theme') ?? 'system');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', theme);
    localStorage.setItem('statskill.theme', theme);
  }, [theme]);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <button
      type="button"
      className="rounded-md border border-hairline p-2 text-ink-2 hover:bg-surface-2"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
