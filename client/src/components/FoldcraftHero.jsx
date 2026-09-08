import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, Brain, TrendingUp, Shield, BarChart2, Play } from 'lucide-react';

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
    <div className="relative min-h-screen w-full overflow-hidden bg-plane text-ink font-sans selection:bg-primary-light">
      {/* Abstract Background Gradient Glows */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 -z-10 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[140px] pointer-events-none" />

      {/* ── Sticky Navbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-hairline bg-surface/80 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-accent text-white font-bold text-lg shadow-glow">
              SS
            </span>
            <span className="text-xl font-bold tracking-tight text-ink">
              StatSkill <span className="text-ai-gradient">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ink-2 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-quiet px-4 py-2 text-sm"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn btn-primary px-5 py-2 text-sm"
            >
              Get Started
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-ink-2 hover:text-ink"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-hairline bg-surface px-6 py-6 space-y-4 animate-slide-up">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-base font-medium text-ink-2 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
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

      {/* ── Hero Section ─────────────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 pt-16 pb-24 lg:pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-pill border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-semibold shadow-xs">
              <Sparkles size={14} className="text-accent" />
              <span className="text-ai-gradient font-bold">MoSPI & NSSTA Framework Ready</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-ink leading-[1.1]">
              Turn Skill Gaps Into <br className="hidden sm:inline" />
              <span className="text-ai-gradient">Career Growth.</span>
            </h1>

            <p className="text-lg sm:text-xl text-ink-2 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover your strengths, identify competency gaps, and follow a personalized learning journey powered by intelligent AI assessment.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary text-base px-8 py-3.5 w-full sm:w-auto shadow-card-hover"
              >
                Start AI Assessment
                <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn btn-quiet text-base px-6 py-3.5 w-full sm:w-auto"
              >
                Explore Learning
              </button>
            </div>

            {/* Micro stats banner */}
            <div className="pt-8 border-t border-hairline grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-ink">50+</p>
                <p className="text-xs text-ink-muted">Competencies</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">0–5 Scale</p>
                <p className="text-xs text-ink-muted">MoSPI Standard</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-ink">100%</p>
                <p className="text-xs text-ink-muted">AI Personalized</p>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Interactive Competency Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto w-full max-w-md aspect-square rounded-card-xl bg-surface/50 border border-hairline p-6 backdrop-blur-xl shadow-card-premium flex flex-col justify-between">

              {/* Card Header visual */}
              <div className="flex items-center justify-between border-b border-hairline pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Brain size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink">Competency Radar</h3>
                    <p className="text-xs text-ink-muted">Live AI Skill Profiling</p>
                  </div>
                </div>
                <span className="pill pill-ai text-[11px]">Active</span>
              </div>

              {/* Floating Skill Card 1: Statistics */}
              <div className="card p-4 shadow-card-hover transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink">Official Statistics</span>
                  <span className="pill pill-success text-[10px]">82% Advanced</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill bg-status-good" style={{ width: '82%' }} />
                </div>
              </div>

              {/* Floating Skill Card 2: Python */}
              <div className="card p-4 shadow-card-hover transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink">Python & Data Analytics</span>
                  <span className="pill pill-warning text-[10px]">68% Intermediate</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill bg-status-warning" style={{ width: '68%' }} />
                </div>
              </div>

              {/* Floating Skill Card 3: AI/ML Gap */}
              <div className="card p-4 shadow-card-hover transform -rotate-2 hover:rotate-0 transition-transform duration-300 border-l-4 border-l-status-critical">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-ink">AI / Machine Learning</span>
                  <span className="pill pill-danger text-[10px]">25% High Gap</span>
                </div>
                <div className="progress-bar h-1.5">
                  <div className="progress-bar-fill bg-status-critical" style={{ width: '25%' }} />
                </div>
              </div>

              <div className="pt-2 text-center">
                <span className="text-xs text-ink-muted flex items-center justify-center gap-1.5">
                  <TrendingUp size={14} className="text-primary" />
                  Target: 80% Average Role Readiness
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
