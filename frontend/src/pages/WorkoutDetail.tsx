import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import RestTimer from '../components/RestTimer'
import SetLogger from '../components/SetLogger'

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: workout, isLoading } = useQuery({
    queryKey: ['workout', id],
    queryFn: () => api.get(`/workouts/${id}`).then((r) => r.data),
    enabled: !!id,
  })

  const { data: sets } = useQuery({
    queryKey: ['workout-sets', id],
    queryFn: () => api.get(`/workouts/${id}/sets`).then((r) => r.data),
    enabled: !!id,
  })

  const completeWorkout = useMutation({
    mutationFn: () =>
      api.patch(`/workouts/${id}`, { completedAt: new Date().toISOString() }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workout', id] })
    },
  })

  if (isLoading || !workout) return <p className="text-slate-400">Loading...</p>

  const completed = !!workout.completedAt

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Workout {new Date(workout.startedAt).toLocaleString()}
          </h1>
          <p className="text-slate-400">
            {completed ? 'Completed' : 'In progress'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/workouts')}
            className="rounded border border-slate-600 px-4 py-2 hover:bg-slate-800"
          >
            Back
          </button>
          {!completed && (
            <button
              onClick={() => completeWorkout.mutate()}
              disabled={completeWorkout.isPending}
              className="rounded bg-green-600 px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Complete Workout
            </button>
          )}
        </div>
      </div>

      <RestTimer />

      {!completed && <SetLogger workoutId={id!} />}

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Completed Sets</h2>
        <ul className="space-y-2">
          {(sets || []).map((s: any) => (
            <li
              key={s.id}
              className="rounded border border-slate-700 bg-slate-800 p-3"
            >
              {s.exercise?.name || 'Exercise'} - {s.reps} reps @ {s.weightKg} kg
              {s.completedAt && (
                <span className="ml-2 text-sm text-slate-400">
                  ({new Date(s.completedAt).toLocaleTimeString()})
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
