import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorNote, Loading, ThemeToggle } from '../components/ui.jsx';

/**
 * Demo personas are printed here so a judge can sign in without a slip of paper.
 * These are seeded throwaway accounts — remove before going real.
 */
const PERSONAS = [
  {
    email: 'rahul.sharma@mospi.gov.in',
    password: 'Officer@123',
    role: 'Statistical Officer · SDRD',
    label: 'Rahul Sharma',
    detail: '7-day streak · AI/ML gap · personalized iGOT pathway',
    tag: 'Learner',
  },
  {
    email: 'trainer@nssta.gov.in',
    password: 'Trainer@123',
    role: 'NSSTA Faculty',
    label: 'Prof. S. Mukherjee',
    detail: 'Curriculum uploads · AI quiz generator · cohort analytics',
    tag: 'Trainer',
  },
  {
    email: 'admin@mospi.gov.in',
    password: 'Admin@123',
    role: 'MoSPI Training Admin',
    label: 'Dr. Vikram Iyer',
    detail: 'Skill heatmaps · workforce readiness · governance',
    tag: 'Admin',
  },
];

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4';

export default function Login() {
  const { user, status, signIn } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (status === 'loading') return <Loading label="Checking your session" />;
  if (user) return <Navigate to={location.state?.from ?? '/'} replace />;

  async function handleLoginWithCredentials(email, password) {
    setBusy(true);
    setError(null);
    try {
      const signedIn = await signIn(email.trim(), password);
      const target =
        signedIn.role === 'admin'
          ? '/admin'
          : signedIn.role === 'trainer'
            ? '/trainer'
            : '/';
      navigate(target, { replace: true });
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy(false);
    }
  }

  async function submit(event) {
    event.preventDefault();
    await handleLoginWithCredentials(form.email, form.password);
  }

  return (
    <div className="grid min-h-screen font-geist md:grid-cols-2">
      {/* ── Left panel: Foldcraft video background ── */}
      <div className="relative hidden overflow-hidden md:flex md:flex-col md:justify-between">
        {/* Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '70% center' }}
          src={VIDEO_SRC}
        />

        {/* Dark gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />

        {/* Content on top of video */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-md px-3.5 py-2 border border-white/20">
              <span
                className="grid h-7 w-7 place-items-center rounded-md text-xs font-bold text-white"
                style={{ background: 'var(--series-1)' }}
                aria-hidden="true"
              >
                SS
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-white">StatSkill AI</p>
                <p className="text-[11px] text-white/60">MoSPI · NSO · State DES</p>
              </div>
            </div>
          </div>

          {/* Hero copy */}
          <div className="max-w-md">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/50">
              AI Competency Intelligence
            </p>
            <h1 className="text-3xl font-medium leading-[1.15] tracking-tight text-white md:text-4xl">
              Competency-based upskilling for the official statistical system
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Every officer's path is computed from the gap between the level
              their role requires and the level their record shows — on a fixed
              0–5 scale, with the arithmetic visible rather than asserted.
            </p>

            <div className="mt-8 space-y-3">
              {[
                'Profile & self-assessment establish current levels',
                'Role requirements define the target',
                'Gap × importance → priority score',
                'Courses matched to gap; quiz records new level',
              ].map((step, i) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-[11px] font-bold text-white/80">
                    {i + 1}
                  </span>
                  <span className="text-sm text-white/70">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-white/30">
            Smart India Hackathon Prototype · MoSPI / NSSTA
          </p>
        </div>
      </div>

      {/* ── Right panel: Sign-in form ── */}
      <div className="flex flex-col justify-center bg-plane p-6 sm:p-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                Welcome back
              </h2>
              <p className="mt-0.5 text-sm text-ink-muted">Sign in to continue</p>
            </div>
            <ThemeToggle />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label">
                Official email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                className="field mt-1"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="field mt-1"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <ErrorNote error={error} />

            <button
              type="submit"
              className="btn-primary w-full gap-2"
              disabled={busy}
            >
              <LogIn size={15} aria-hidden="true" />
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-ink-2">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-ink underline underline-offset-2">
              Register
            </Link>
          </p>

          {/* Demo personas */}
          <div className="mt-6 rounded-card border border-hairline bg-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="label">Evaluation Demo Personas</p>
              <span className="flex items-center gap-1 text-[10px] text-ink-muted">
                <ArrowRight size={10} />
                1-click sign-in
              </span>
            </div>
            <ul className="space-y-2">
              {PERSONAS.map((persona) => (
                <li
                  key={persona.email}
                  className="rounded-md border border-hairline/60 bg-surface-2/40 p-2.5 transition-all hover:border-hairline hover:bg-surface-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-semibold text-ink">{persona.label}</p>
                        <span className="rounded-full bg-surface-2 px-1.5 py-px text-[10px] font-medium text-ink-muted">
                          {persona.tag}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-series-1">{persona.role}</p>
                      <p className="mt-0.5 truncate text-[11px] text-ink-muted">{persona.detail}</p>
                    </div>
                    <button
                      type="button"
                      disabled={busy}
                      className="shrink-0 rounded bg-ink px-2.5 py-1 text-[11px] font-medium text-plane transition-opacity hover:opacity-80 disabled:opacity-50"
                      onClick={() =>
                        handleLoginWithCredentials(persona.email, persona.password)
                      }
                    >
                      Sign in
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
