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
} from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { initials } from '../lib/format.js';
import { ThemeToggle } from './ui.jsx';
import FloatingChatbot from './FloatingChatbot.jsx';

const LEARNER_NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/profile', label: 'Profile', icon: UserRound },
  { to: '/assessment', label: 'Assessment', icon: ClipboardCheck },
  { to: '/path', label: 'Learning path', icon: RouteIcon },
  { to: '/my-learning', label: 'My courses', icon: BookOpen },
  { to: '/progress', label: 'Progress', icon: TrendingUp },
  { to: '/quiz', label: 'Quizzes', icon: GraduationCap },
  { to: '/streak', label: 'Streaks & XP', icon: Flame },
  { to: '/discussions', label: 'Discussions', icon: Users },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/assistant', label: 'AI assistant', icon: Sparkles },
];

const TRAINER_NAV = [
  { to: '/trainer', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/trainer/generator', label: 'AI Quiz Generator', icon: Sparkles },
  { to: '/trainer/materials', label: 'Curriculum Materials', icon: FileText },
  { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
];

const ADMIN_NAV = [
  { to: '/admin', label: 'Workforce analytics', icon: BarChart3, end: true },
  { to: '/admin/officers', label: 'Officers', icon: Users },
  { to: '/admin/courses', label: 'Courses', icon: BookOpen },
  { to: '/admin/questions', label: 'Questions', icon: HelpCircle },
];

export default function Layout() {
  const { user, isAdmin, isTrainer, signOut } = useAuth();
  const navigate = useNavigate();
  const nav = isAdmin ? ADMIN_NAV : isTrainer ? TRAINER_NAV : LEARNER_NAV;

  return (
    <div className="min-h-screen bg-plane">
      <header className="border-b border-hairline bg-surface sticky top-0 z-20 backdrop-blur-sm bg-opacity-95">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <span
              className="grid h-8 w-8 place-items-center rounded-md text-sm font-bold text-white shadow-sm"
              style={{ background: 'var(--series-1)' }}
              aria-hidden="true"
            >
              SS
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">StatSkill AI</p>
              <p className="text-[11px] text-ink-muted">MoSPI · NSO · State DES</p>
            </div>
          </div>

          <nav className="ml-4 hidden items-center gap-1 lg:flex flex-wrap" aria-label="Sections">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    isActive ? 'bg-surface-2 text-ink shadow-xs' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
                  }`
                }
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 shrink-0">
            {/* Learner Streak & XP badge in header */}
            {!isAdmin && !isTrainer && (
              <div className="hidden items-center gap-2 rounded-full border border-hairline bg-surface px-2.5 py-1 sm:flex shadow-xs">
                <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400" title="Capacity Building Streak">
                  <Flame size={13} className="fill-amber-500 text-amber-500" />
                  <span>{user?.currentStreak ?? 0}d</span>
                </span>
                <span className="text-[10px] text-hairline">|</span>
                <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400" title="Total Experience Points">
                  <Zap size={13} className="fill-indigo-500 text-indigo-500" />
                  <span>{user?.xp ?? 0} XP</span>
                </span>
              </div>
            )}

            <ThemeToggle />
            
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-ink leading-tight">{user?.name}</p>
              <p className="text-[10px] text-ink-muted leading-tight">
                {isAdmin ? 'MoSPI Administrator' : isTrainer ? 'NSSTA Trainer' : (user?.jobRole?.title || user?.jobRole || 'Statistical Officer')}
              </p>
            </div>
            
            <span
              className="grid h-8 w-8 place-items-center rounded-full border border-hairline text-xs font-semibold text-ink-2 bg-surface-2"
              aria-hidden="true"
            >
              {initials(user?.name)}
            </span>
            
            <button
              type="button"
              className="rounded-md border border-hairline p-1.5 text-ink-2 hover:bg-surface-2 transition-colors"
              onClick={() => {
                signOut();
                navigate('/login', { replace: true });
              }}
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={15} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Medium/Small screens get the nav as a horizontal scrolling strip */}
        <nav
          className="flex gap-1 overflow-x-auto border-t border-hairline px-4 py-1.5 lg:hidden"
          aria-label="Sections"
        >
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `whitespace-nowrap flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs ${
                  isActive ? 'bg-surface-2 font-medium text-ink' : 'text-ink-2'
                }`
              }
            >
              <Icon size={13} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-6">
        <Outlet />
      </main>

      <footer className="mx-auto max-w-7xl px-5 pb-8 pt-2 text-[11px] text-ink-muted">
        Smart India Hackathon Prototype · Competency levels recorded against 0–5 MoSPI / NSSTA framework scale.
      </footer>

      {/* Floating contextual AI Assistant available across all pages */}
      <FloatingChatbot />
    </div>
  );
}
