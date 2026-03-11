import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { useEffect, useMemo, useRef } from 'react'
import gsap from 'gsap'
import AnimatedLoader from '../components/AnimatedLoader'

export default function Dashboard() {
  const heroRef = useRef<HTMLDivElement | null>(null)

  const { data: workouts, isLoading: workoutsLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('/workouts').then((r) => r.data),
  })

  const { data: prs, isLoading: prsLoading } = useQuery({
    queryKey: ['analytics', 'prs'],
    queryFn: () => api.get('/analytics/personal-records').then((r) => r.data),
  })

  const { data: measurements, isLoading: measurementsLoading } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => api.get('/measurements').then((r) => r.data),
  })

  const recent = workouts?.slice?.(0, 4) || []
  const inProgress = (workouts || []).filter((w: any) => !w.completedAt).length
  const completed = (workouts || []).filter((w: any) => !!w.completedAt).length

  const latestWeight = useMemo(() => {
    const w = (measurements || []).find((m: any) => m.type === 'weight')
    if (!w) return null
    return { value: Number(w.value), unit: w.unit || 'kg' }
  }, [measurements])

  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    if (reduced) return
    if (!heroRef.current) return

    const words = heroRef.current.querySelectorAll('[data-kinetic-word]')
    gsap.fromTo(
      words,
      { opacity: 0, y: 18, rotateX: 20 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: 0.045,
      },
    )
    gsap.fromTo(
      heroRef.current.querySelectorAll('[data-hero-fade]'),
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.25 },
    )
  }, [])

  const headlineWords = useMemo(
    () => 'Train with clarity. Track with style.'.split(' '),
    [],
  )

  return (
    <div className="space-y-5">
      <section ref={heroRef} className="bentoCard overflow-hidden">
        <div className="relative">
          <div
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-fuchsia-500/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-primary-500/20 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <p className="muted mb-3 text-sm" data-hero-fade>
              Your training, with live sync and shareable sessions.
            </p>

            <h1 className="text-balance text-3xl font-bold leading-tight sm:text-4xl">
              {headlineWords.map((w, idx) => (
                <span
                  key={idx}
                  data-kinetic-word
                  className="inline-block [transform-style:preserve-3d]"
                >
                  <span className="bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                    {w}
                  </span>
                  {idx < headlineWords.length - 1 ? '\u00A0' : ''}
                </span>
              ))}
            </h1>

            <p className="muted mt-4 max-w-2xl text-sm" data-hero-fade>
              Start a workout, log sets fast, watch your PRs evolve, and share a
              session with a friend—updates stream in real time.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3" data-hero-fade>
              <Link to="/workouts/new" className="shineButton">
                Start Workout
              </Link>
              <Link
                to="/analytics"
                className="rounded-xl border border-white/10 bg-white/0 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/5"
              >
                View Progress
              </Link>
              <span className="muted text-xs">
                Tip: Invite a partner from Sharing.
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bentoGrid">
        <div className="bentoCard col-span-12 md:col-span-4">
          <p className="muted text-xs">Workouts</p>
          <div className="mt-2 flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold">{(workouts || []).length}</div>
              <div className="muted mt-1 text-sm">
                {inProgress} in progress · {completed} completed
              </div>
            </div>
            <div className="rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300">
              Live sync ready
            </div>
          </div>
        </div>

        <div className="bentoCard col-span-12 md:col-span-4">
          <p className="muted text-xs">Latest body weight</p>
          <div className="mt-2">
            {measurementsLoading ? (
              <AnimatedLoader label="Fetching measurements…" />
            ) : latestWeight ? (
              <>
                <div className="text-3xl font-bold">
                  {latestWeight.value.toFixed(1)}{' '}
                  <span className="text-base font-semibold text-slate-300">
                    {latestWeight.unit}
                  </span>
                </div>
                <div className="muted mt-1 text-sm">
                  Keep it consistent—weekly check-ins work best.
                </div>
              </>
            ) : (
              <div className="muted mt-2 text-sm">
                No weight entry yet. Add one in Measurements.
              </div>
            )}
          </div>
        </div>

        <div className="bentoCard col-span-12 md:col-span-4">
          <p className="muted text-xs">Top PRs</p>
          <div className="mt-2">
            {prsLoading ? (
              <AnimatedLoader label="Calculating PRs…" />
            ) : (prs || []).length ? (
              <ul className="space-y-2">
                {(prs || []).slice(0, 3).map((p: any) => (
                  <li key={p.exerciseId} className="flex justify-between">
                    <span className="text-sm text-slate-200">
                      {p.exerciseName}
                    </span>
                    <span className="text-sm font-semibold text-primary-300">
                      {p.weight}kg × {p.reps}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted mt-2 text-sm">
                Complete a weighted set to unlock PRs.
              </div>
            )}
          </div>
        </div>

        <div className="bentoCard col-span-12 md:col-span-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Recent workouts</h2>
              <p className="muted text-sm">Pick up where you left off.</p>
            </div>
            <Link
              to="/workouts"
              className="rounded-xl bg-white/6 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
            >
              View all
            </Link>
          </div>

          <div className="mt-4">
            {workoutsLoading ? (
              <AnimatedLoader label="Loading workouts…" />
            ) : recent.length === 0 ? (
              <div className="muted text-sm">
                No workouts yet. Start your first one.
              </div>
            ) : (
              <ul className="space-y-2">
                {recent.map((w: any) => (
                  <li key={w.id}>
                    <Link
                      to={`/workouts/${w.id}`}
                      className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/3 px-4 py-3 hover:bg-white/6"
                    >
                      <div>
                        <div className="text-sm font-semibold text-slate-100">
                          {new Date(w.startedAt).toLocaleString()}
                        </div>
                        <div className="muted text-xs">
                          {w.notes ? w.notes : '—'}
                        </div>
                      </div>
                      <span
                        className={[
                          'rounded-full px-3 py-1 text-xs font-semibold',
                          w.completedAt
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-amber-500/15 text-amber-300',
                        ].join(' ')}
                      >
                        {w.completedAt ? 'Completed' : 'In progress'}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bentoCard col-span-12 md:col-span-5">
          <h2 className="text-lg font-semibold">Quick actions</h2>
          <p className="muted text-sm">
            Share workouts/templates and collaborate live.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/sharing"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/8"
            >
              <div className="text-sm font-semibold">Sharing</div>
              <div className="muted mt-1 text-xs">
                Grant view/edit access.
              </div>
            </Link>
            <Link
              to="/templates"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/8"
            >
              <div className="text-sm font-semibold">Templates</div>
              <div className="muted mt-1 text-xs">
                Build reusable workouts.
              </div>
            </Link>
            <Link
              to="/exercises"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/8"
            >
              <div className="text-sm font-semibold">Exercise library</div>
              <div className="muted mt-1 text-xs">Add custom movements.</div>
            </Link>
            <Link
              to="/measurements"
              className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/8"
            >
              <div className="text-sm font-semibold">Measurements</div>
              <div className="muted mt-1 text-xs">Track weight and more.</div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
