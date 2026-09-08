import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Route as RouteIcon,
  UserRound,
  Users,
  TrendingUp,
  Flame,
  Trophy,
  Sparkles,
  FileText,
  Zap,
  Search,
  Bell
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../lib/format.js';
import { ThemeToggle } from './ui.jsx';
import FloatingChatbot from './FloatingChatbot.jsx';

const LEARNER_NAV = [
  { to: '/', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/path', label: 'Learning Path', icon: RouteIcon },
  { to: '/my-learning', label: 'Courses', icon: BookOpen },
  { to: '/quiz', label: 'Quizzes', icon: GraduationCap },
  { to: '/discussions', label: 'Communities', icon: Users },
];

const SIDEBAR_SECONDARY_NAV = [
  { to: '/assessment', label: 'Assessments', icon: ClipboardCheck },
  { to: '/streak', label: 'Achievements', icon: Trophy },
  { to: '/leaderboard', label: 'Leaderboard', icon: TrendingUp },
];

const TRAINER_NAV = [
  { to: '/trainer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/trainer/generator', label: 'AI Quiz Generator', icon: Sparkles },
  { to: '/trainer/materials', label: 'Curriculum Materials', icon: FileText },
  { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Workforce Hub', icon: BarChart3, end: true },
  { to: '/admin/officers', label: 'Officers', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
];

export default function Layout() {
  const { user, isAdmin, isTrainer, signOut } = useAuth();
  const navigate = useNavigate();
  const primaryNav = isAdmin ? ADMIN_NAV : isTrainer ? TRAINER_NAV : LEARNER_NAV;

  return (
    <div className="min-h-screen bg-plane flex flex-col lg:flex-row">
      {/* ── Sidebar (Desktop) / Bottom Nav (Mobile) ── */}
      <aside className="border-r border-hairline bg-surface flex-shrink-0 z-20
                        transform lg:w-[260px] lg:flex flex-col hidden sticky top-0 h-screen">

        <div className="flex h-20 items-center justify-between px-6 border-b border-hairline">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg shadow-glow bg-gradient-accent text-white font-bold text-lg leading-none">
              SS
            </span>
            <div className="leading-tight">
              <h1 className="text-xl font-bold tracking-tight text-ink">StatSkill AI</h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8" aria-label="Sidebar">
          {/* Main Navigation */}
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Menu</div>
            <div className="space-y-1">
              {primaryNav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-light text-primary nav-active'
                        : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                    }`
                  }
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>

          {/* Secondary Navigation (Learner Only) */}
          {!isAdmin && !isTrainer && (
            <div>
              <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Your Progress</div>
              <div className="space-y-1">
                {SIDEBAR_SECONDARY_NAV.map(({ to, label, icon: Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-button px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-primary-light text-primary nav-active'
                          : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* User Profile Footer in Sidebar */}
        <div className="p-4 border-t border-hairline">
          <div className="flex items-center gap-3 rounded-button p-2 hover:bg-surface-2 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-3 text-sm font-semibold text-ink shadow-sm">
              {initials(user?.name)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
              <p className="text-xs text-ink-muted truncate">
                {isAdmin ? 'Administrator' : isTrainer ? 'Trainer' : (user?.jobRole?.title || 'Officer')}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); signOut(); navigate('/login', { replace: true }); }}
              className="text-ink-muted hover:text-critical"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen relative max-w-full">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-surface/80 backdrop-blur-md border-b border-hairline h-20 px-6 sm:px-10 flex items-center justify-between">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2">
             <span className="grid h-8 w-8 place-items-center rounded-md bg-gradient-accent text-white font-bold text-sm leading-none">
              SS
            </span>
          </div>

          <div className="flex-1 flex items-center max-w-2xl px-4 lg:px-0">
             <div className="relative w-full group hidden md:block">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search courses, skills, and communities..."
                  className="w-full bg-surface-2 border border-transparent rounded-pill py-2.5 pl-12 pr-4 text-sm focus:bg-surface focus:border-primary focus:ring-4 focus:ring-primary-light transition-all outline-none"
                />
             </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            {!isAdmin && !isTrainer && (
              <div className="hidden sm:flex items-center gap-4 px-4 py-1.5 rounded-pill bg-surface-2 border border-hairline">
                <div className="flex items-center gap-1.5" title="Learning Streak">
                  <Flame size={16} className="text-streak streak-glow" />
                  <span className="text-sm font-bold text-ink">{user?.currentStreak ?? 0}</span>
                </div>
                <div className="w-px h-4 bg-baseline"></div>
                <div className="flex items-center gap-1.5" title="XP Earned">
                  <Zap size={16} className="fill-xp text-xp" />
                  <span className="text-sm font-bold text-ink">{user?.xp ?? 0}</span>
                </div>
              </div>
            )}

            <button className="btn btn-ghost p-2 relative rounded-full">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-critical rounded-full border-2 border-surface"></span>
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 px-6 sm:px-10 py-8 mx-auto w-full max-w-screen-2xl mb-16 lg:mb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/90 backdrop-blur-md border-t border-hairline pb-safe-area">
        <div className="flex justify-between px-2 py-1">
          {primaryNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 py-2 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary'
                    : 'text-ink-muted'
                }`
              }
            >
              <Icon size={20} />
              <span className="text-[10px] mt-1 font-medium select-none truncate w-full text-center">{label}</span>
            </NavLink>
          ))}
          {/* Also add Profile for Mobile since it's in the sidebar bottom on desktop */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-16 py-2 px-1 rounded-xl transition-all ${
                isActive ? 'text-primary' : 'text-ink-muted'
              }`
            }
          >
            <UserRound size={20} />
            <span className="text-[10px] mt-1 font-medium select-none">Profile</span>
          </NavLink>
        </div>
      </nav>

      {/* Floating contextual AI Assistant */}
      <FloatingChatbot />
    </div>
  );
}
