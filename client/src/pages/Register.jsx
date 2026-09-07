import { useMemo, useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ErrorNote, Loading, ThemeToggle } from '../components/ui.jsx';
import { api, endpoints } from '../lib/index.js';
import { useApi } from '../hooks/useApi.js';

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_204221_5339e40b-e73d-4ab0-9c65-79c18c66fd50.mp4';

export default function Register() {
  const { user, status, signIn } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: '',
    jobRole: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const options = useApi(endpoints.registerOptions);
  const roles = useMemo(
    () =>
      (options.data?.jobRoles ?? []).filter(
        (role) =>
          !form.department ||
          String(role.department?._id ?? role.department) === form.department
      ),
    [options.data, form.department]
  );

  if (status === 'loading') return <Loading label="Checking your session" />;
  if (user) return <Navigate to={location.state?.from ?? '/'} replace />;

  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError(new Error('Passwords do not match.'));
      return;
    }
    if (form.password.length < 8) {
      setError(new Error('Password must be at least 8 characters long.'));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await api.post(endpoints.register, {
        name: form.name.trim(),
        email: form.email.trim(),
        employeeId: form.employeeId.trim(),
        department: form.department,
        jobRole: form.jobRole,
        password: form.password,
      });
      const signedIn = await signIn(form.email.trim(), form.password);
      navigate(signedIn.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (caught) {
      setError(caught);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen font-geist md:grid-cols-2">
      {/* ── Left panel: Foldcraft video background ── */}
      <div className="relative hidden overflow-hidden md:flex md:flex-col md:justify-between">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: '70% center' }}
          src={VIDEO_SRC}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/30" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10">
          <div className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-md px-3.5 py-2 w-fit border border-white/20">
            <span
              className="grid h-7 w-7 place-items-center rounded-md text-xs font-bold text-white shadow-sm"
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

          <div className="max-w-md">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-white/50">
              Join the platform
            </p>
            <h1 className="text-3xl font-medium leading-[1.15] tracking-tight text-white md:text-4xl">
              Competency-based upskilling for the official statistical system
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Create an account to track your learning journey, establish your
              baseline competencies, and discover AI-recommended pathways.
            </p>
          </div>

          <p className="text-[11px] text-white/30">
            Smart India Hackathon Prototype · MoSPI / NSSTA
          </p>
        </div>
      </div>

      {/* ── Right panel: Registration form ── */}
      <div className="flex flex-col justify-center bg-plane p-6 sm:p-10">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-ink">
              Create account
            </h2>
            <ThemeToggle />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                required
                className="field mt-1"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Official email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="field mt-1"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="employeeId" className="label">
                  Employee ID
                </label>
                <input
                  id="employeeId"
                  type="text"
                  required
                  className="field mt-1"
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="department" className="label">
                  Department
                </label>
                <select
                  id="department"
                  required
                  className="field mt-1"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value, jobRole: '' })
                  }
                >
                  <option value="">Choose...</option>
                  {(options.data?.departments ?? []).map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="jobRole" className="label">
                Job role
              </label>
              <select
                id="jobRole"
                required
                disabled={!form.department || options.loading}
                className="field mt-1"
                value={form.jobRole}
                onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
              >
                <option value="">Choose role...</option>
                {roles.map((role) => (
                  <option key={role._id} value={role._id}>
                    {role.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="field mt-1"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                className="field mt-1"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>

            <ErrorNote error={error ?? options.error} onRetry={options.refetch} />

            <button type="submit" className="btn-primary w-full gap-2" disabled={busy}>
              <UserPlus size={15} aria-hidden="true" />
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-ink-2">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-ink underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
