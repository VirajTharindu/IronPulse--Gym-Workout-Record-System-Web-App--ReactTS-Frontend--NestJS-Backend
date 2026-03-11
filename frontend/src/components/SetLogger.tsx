import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function SetLogger({ workoutId }: { workoutId: string }) {
  const [exerciseId, setExerciseId] = useState('')
  const [reps, setReps] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const qc = useQueryClient()

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => api.get('/exercises').then((r) => r.data),
  })

  const addSet = useMutation({
    mutationFn: () => {
      const sets = qc.getQueryData(['workout-sets', workoutId]) as any[]
      const order = sets?.length ?? 0
      return api.post(`/workouts/${workoutId}/sets`, {
        exerciseId,
        setOrder: order,
        reps: parseInt(reps, 10) || 0,
        weightKg: parseFloat(weightKg) || 0,
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workout-sets', workoutId] })
      setReps('')
      setWeightKg('')
    },
  })

  const completeSet = useMutation({
    mutationFn: ({ setId, setReps, setWeightKg }: { setId: string; setReps: number; setWeightKg: number }) =>
      api.patch(`/workouts/${workoutId}/sets/${setId}`, {
        completedAt: new Date().toISOString(),
        reps: setReps,
        weightKg: setWeightKg,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['workout-sets', workoutId] })
      setReps('')
      setWeightKg('')
    },
  })

  const { data: sets } = useQuery({
    queryKey: ['workout-sets', workoutId],
    queryFn: () => api.get(`/workouts/${workoutId}/sets`).then((r) => r.data),
  })

  const pendingSets = (sets || []).filter((s: any) => !s.completedAt)

  return (
    <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-400">Log Set</h3>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="mb-1 block text-xs text-slate-500">Exercise</label>
          <select
            value={exerciseId}
            onChange={(e) => setExerciseId(e.target.value)}
            className="rounded border border-slate-600 bg-slate-700 px-3 py-2"
          >
            <option value="">Select...</option>
            {(exercises || []).map((e: any) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Reps</label>
          <input
            type="number"
            min="0"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-20 rounded border border-slate-600 bg-slate-700 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-slate-500">Weight (kg)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={weightKg}
            onChange={(e) => setWeightKg(e.target.value)}
            className="w-24 rounded border border-slate-600 bg-slate-700 px-3 py-2"
          />
        </div>
        <button
          onClick={() => addSet.mutate()}
          disabled={!exerciseId || addSet.isPending}
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          Add Set
        </button>
      </div>
      {pendingSets.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-sm text-slate-400">Complete pending set:</p>
          {pendingSets.map((s: any) => (
            <button
              key={s.id}
              onClick={() =>
                completeSet.mutate({
                  setId: s.id,
                  setReps: Number(s.reps),
                  setWeightKg: Number(s.weightKg),
                })
              }
              disabled={completeSet.isPending}
              className="mr-2 rounded bg-green-600 px-2 py-1 text-sm hover:bg-green-700 disabled:opacity-50"
            >
              {s.exercise?.name} - {s.reps}x{s.weightKg}kg
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
