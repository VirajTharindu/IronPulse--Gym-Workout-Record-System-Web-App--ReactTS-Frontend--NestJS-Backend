import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useWorkoutSocket } from '../hooks/useWorkoutSocket'
import { useLenis } from '../hooks/useLenis'

export default function Layout({ children }: { children: React.ReactNode }) {
  useWorkoutSocket()
  useLenis()
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const nav = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/workouts', label: 'Workouts' },
    { to: '/templates', label: 'Templates' },
    { to: '/exercises', label: 'Exercises' },
    { to: '/measurements', label: 'Measurements' },
    { to: '/analytics', label: 'Analytics' },
    { to: '/sharing', label: 'Sharing' },
  ]

  return (
    <div className="appShell">
      <div className="noiseOverlay" />
      <header className="sticky top-0 z-50">
        <div className="mx-auto max-w-6xl px-4 pt-4">
          <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="group flex items-center gap-2 rounded-xl px-2 py-1"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500/90 to-fuchsia-500/70 shadow-[0_10px_30px_rgba(14,165,233,0.18)]">
                  <span className="text-sm font-black">I</span>
                </span>
                <span className="text-sm font-semibold tracking-wide text-slate-100">
                  IronPulse
                </span>
              </Link>
              <div className="hidden items-center gap-1 md:flex">
                {nav.map(({ to, label }) => {
                  const active = location.pathname.startsWith(to)
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={[
                        'rounded-xl px-3 py-2 text-sm transition',
                        active
                          ? 'bg-white/8 text-white'
                          : 'text-slate-300 hover:bg-white/6 hover:text-white',
                      ].join(' ')}
                    >
                      {label}
                    </Link>
                  )
                })}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden flex-col items-end leading-tight sm:flex">
                <span className="text-xs text-slate-400">Signed in as</span>
                <span className="text-sm font-medium text-slate-100">
                  {user?.displayName}
                </span>
              </div>
              <button
                onClick={logout}
                className="rounded-xl bg-white/8 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-10 pt-6">{children}</main>
    </div>
  )
}
