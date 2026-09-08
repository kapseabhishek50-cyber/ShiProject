import { AlertCircle, AlertTriangle, CheckCircle2, CircleDot, Loader2, Moon, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { bandMeta } from '../lib/format.js';

/**
 * Premium UI Component Library - StatSkill AI Design System
 */

export function Card({ title, subtitle, action, children, className = '', variant = 'default' }) {
  const baseClass = variant === 'glass' ? 'card-glass' : variant === 'ai' ? 'card-ai' : 'card';
  return (
    <section className={`${baseClass} ${className}`}>
      {(title || action) && (
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-card-title font-semibold text-ink">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

export function StatTile({ label, value, hint, delta, icon: Icon }) {
  return (
    <div className="metric-tile">
      <div className="flex items-center justify-between mb-3">
        <p className="label">{label}</p>
        {Icon && <Icon size={18} className="text-primary" />}
      </div>
      <p className="text-3xl font-bold tracking-tight text-ink">{value}</p>
      {delta && (
        <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--delta-up)' }}>
          <CheckCircle2 size={14} />
          {delta}
        </p>
      )}
      {hint && <p className="mt-2 text-sm text-ink-muted">{hint}</p>}
    </div>
  );
}

export function Badge({ band, children, variant = 'neutral' }) {
  if (band) {
    const meta = bandMeta(band);
    const Icon = STATUS_ICON[meta.role] ?? CircleDot;
    return (
      <span className={`pill pill-${meta.role}`} title={`${meta.label} priority`}>
        <Icon size={14} />
        {children ?? meta.label}
      </span>
    );
  }
  return <span className={`pill pill-${variant}`}>{children}</span>;
}

const STATUS_ICON = {
  good: CheckCircle2,
  warning: AlertTriangle,
  serious: AlertCircle,
  critical: X,
};

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variantClass = `btn-${variant}`;
  return (
    <button className={`btn ${variantClass} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Loading({ label = 'Loading' }) {
  return (
    <div className="flex items-center gap-3 py-12 text-sm font-medium text-ink-muted" role="status">
      <Loader2 size={20} className="animate-spin text-primary" />
      {label}…
    </div>
  );
}

export function Empty({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {title && <h3 className="text-lg font-semibold text-ink">{title}</h3>}
      {description && <p className="mt-1 text-sm text-ink-muted max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

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
      className="btn btn-ghost p-2"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

// Error message component used for inline error display with retry capability
export function ErrorNote({ error, onRetry, className = '' }) {
  if (!error) return null;
  return (
    <div
      className={`flex items-start gap-2 rounded-md border border-hairline bg-surface-2 p-3 text-sm text-ink ${className}`}
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
