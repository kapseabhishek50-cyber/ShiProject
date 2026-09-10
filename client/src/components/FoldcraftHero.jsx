import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, Brain, TrendingUp, ShieldCheck, BarChart2, Landmark } from 'lucide-react';

export default function FoldcraftHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Explore', href: '#explore' },
    { label: 'Learning Paths', href: '#paths' },
    { label: 'Communities', href: '#communities' },
    { label: 'About', href: '#about' },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-plane text-ink font-sans">
      {/* Subtle top accent wash */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{ background: 'linear-gradient(180deg, var(--primary-light) 0%, transparent 100%)' }} />

      {/* ── Clean white navbar ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-hairline bg-surface">
        {/* Govt trust strip */}
        <div className="w-full" style={{ background: 'var(--navy)' }}>
          <div className="mx-auto max-w-7xl px-6 py-1 flex items-center gap-2">
            <Landmark size={12} className="text-white/80" />
            <p className="text-[11px] font-medium text-white/85">
              Competency intelligence for the Indian official statistical system · MoSPI / NSSTA
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-button text-white font-bold text-[13px]" style={{ background: 'var(--navy)' }}>
              SS
            </span>
            <span className="text-[17px] font-bold tracking-tight text-ink">
              StatSkill AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-ink-2 hover:text-primary transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-quiet"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-2 hover:text-ink"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-hairline bg-surface px-6 py-5 space-y-4 animate-slide-up">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-ink-2 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 flex flex-col gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-quiet w-full justify-center"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn btn-primary w-full justify-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero Section ───────────────────────────────────────── */}
      <main className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 lg:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">

          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left animate-enter">
            <div className="inline-flex items-center gap-2 rounded-pill border border-primary-border bg-primary-light px-3 py-1 text-xs font-semibold">
              <ShieldCheck size={13} className="text-primary" />
              <span className="text-primary">MoSPI & NSSTA Framework Ready</span>
            </div>

            <h1 className="text-hero-mobile sm:text-hero-desktop font-bold tracking-tight text-ink leading-[1.15]">
              Turn Skill Gaps Into <br className="hidden sm:inline" />
              <span className="text-primary">Career Growth.</span>
            </h1>

            <p className="text-[15px] text-ink-2 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover your strengths, identify competency gaps, and follow a personalized learning journey powered by intelligent AI assessment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary !text-sm !px-5 !py-2.5 w-full sm:w-auto"
              >
                Start AI Assessment
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-quiet !text-sm !px-5 !py-2.5 w-full sm:w-auto"
              >
                Explore Learning
              </button>
            </div>

            {/* Trust indicators */}
            <div className="pt-6 border-t border-hairline grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
              <div>
                <p className="tnum text-xl font-bold text-ink">50+</p>
                <p className="text-xs text-ink-muted">Competencies</p>
              </div>
              <div>
                <p className="tnum text-xl font-bold text-ink">0–5 Scale</p>
                <p className="text-xs text-ink-muted">MoSPI Standard</p>
              </div>
              <div>
                <p className="tnum text-xl font-bold text-ink">100%</p>
                <p className="text-xs text-ink-muted">AI Personalized</p>
              </div>
            </div>
          </div>

          {/* Right Column: Competency Dashboard Card */}
          <div className="lg:col-span-5 animate-enter-1">
            <div className="relative mx-auto w-full max-w-md rounded-card-lg bg-surface border border-hairline p-5 shadow-card space-y-3">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-hairline pb-3.5">
                <div className="flex items-center gap-2.5">
                  <span className="icon-chip">
                    <Brain size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[13px] font-bold text-ink">Competency Radar</h3>
                    <p className="text-[11px] text-ink-muted">Live AI Skill Profiling</p>
                  </div>
                </div>
                <span className="pill pill-success text-[11px]">Active</span>
              </div>

              {/* Skill rows */}
              <div className="rounded-button border border-hairline bg-plane p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink">Official Statistics</span>
                  <span className="pill pill-success text-[10px]">82% Advanced</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: '82%', background: 'var(--status-good)' }} />
                </div>
              </div>

              <div className="rounded-button border border-hairline bg-plane p-3.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink">Python & Data Analytics</span>
                  <span className="pill pill-warning text-[10px]">68% Intermediate</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: '68%', background: 'var(--status-warning)' }} />
                </div>
              </div>

              <div className="rounded-button border border-hairline bg-plane p-3.5" style={{ borderLeft: '3px solid var(--status-critical)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-ink">AI / Machine Learning</span>
                  <span className="pill pill-danger text-[10px]">25% High Gap</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: '25%', background: 'var(--status-critical)' }} />
                </div>
              </div>

              <div className="pt-1.5 text-center border-t border-hairline">
                <span className="text-xs text-ink-muted flex items-center justify-center gap-1.5 pt-2.5">
                  <TrendingUp size={13} className="text-primary" />
                  Target: 80% Average Role Readiness
                </span>
              </div>
            </div>

            {/* Supporting mini-cards */}
            <div className="mx-auto max-w-md grid grid-cols-2 gap-3 mt-3">
              <div className="card !p-3.5 flex items-center gap-2.5">
                <span className="icon-chip !w-8 !h-8"><BarChart2 size={15} strokeWidth={1.8} /></span>
                <div>
                  <p className="text-xs font-bold text-ink">Gap Analytics</p>
                  <p className="text-[11px] text-ink-muted">Priority scored</p>
                </div>
              </div>
              <div className="card !p-3.5 flex items-center gap-2.5">
                <span className="icon-chip !w-8 !h-8"><Sparkles size={15} strokeWidth={1.8} /></span>
                <div>
                  <p className="text-xs font-bold text-ink">AI Pathways</p>
                  <p className="text-[11px] text-ink-muted">Role-mapped</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-surface">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-ink-muted">StatSkill AI · Smart India Hackathon Prototype · MoSPI / NSSTA</p>
          <p className="text-xs text-ink-muted">Secure · Role-based · Audit-logged</p>
        </div>
      </footer>
    </div>
  );
}
