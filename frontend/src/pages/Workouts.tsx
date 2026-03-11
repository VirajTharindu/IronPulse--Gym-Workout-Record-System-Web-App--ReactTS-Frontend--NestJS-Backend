import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function Workouts() {
  const { data: workouts, isLoading } = useQuery({
    queryKey: ['workouts'],
    queryFn: () => api.get('/workouts').then((r) => r.data),
  })

  if (isLoading) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Workouts</h1>
        <Link
          to="/workouts/new"
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600"
        >
          New Workout
        </Link>
      </div>
      <ul className="space-y-2">
        {(workouts || []).map((w: any) => (
          <li key={w.id}>
            <Link
              to={`/workouts/${w.id}`}
              className="flex items-center justify-between rounded border border-slate-700 p-4 hover:bg-slate-800"
            >
              <span>{new Date(w.startedAt).toLocaleString()}</span>
              <span className={w.completedAt ? 'text-green-400' : 'text-amber-400'}>
                {w.completedAt ? 'Completed' : 'In progress'}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
