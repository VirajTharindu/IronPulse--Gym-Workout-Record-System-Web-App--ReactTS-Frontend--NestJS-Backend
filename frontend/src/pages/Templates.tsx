import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function Templates() {
  const [name, setName] = useState('')
  const [exerciseIds, setExerciseIds] = useState<string[]>([])
  const qc = useQueryClient()
  const { data: templates, isLoading } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.get('/templates').then((r) => r.data),
  })

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => api.get('/exercises').then((r) => r.data),
  })

  const addTemplate = useMutation({
    mutationFn: () => {
      const exList = (exercises || []).filter((e: any) => exerciseIds.includes(e.id))
      return api.post('/templates', {
        name,
        exercises: exList.map((e: any) => ({
          exerciseId: e.id,
          name: e.name,
          muscleGroup: e.muscleGroup,
          targetSets: 3,
        })),
      })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['templates'] })
      setName('')
      setExerciseIds([])
    },
  })

  const remove = useMutation({
    mutationFn: (id: string) => api.delete(`/templates/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['templates'] }),
  })

  const toggleExercise = (id: string) => {
    setExerciseIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  if (isLoading) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Templates</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          addTemplate.mutate()
        }}
        className="mb-8 rounded border border-slate-700 bg-slate-800 p-4"
      >
        <h3 className="mb-3 font-semibold">Create Template</h3>
        <input
          placeholder="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-3 w-full max-w-xs rounded border border-slate-600 bg-slate-700 px-3 py-2"
          required
        />
        <p className="mb-2 text-sm text-slate-400">Select exercises:</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {(exercises || []).map((e: any) => (
            <button
              key={e.id}
              type="button"
              onClick={() => toggleExercise(e.id)}
              className={`rounded px-2 py-1 text-sm ${
                exerciseIds.includes(e.id)
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {e.name}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={addTemplate.isPending || !name || exerciseIds.length === 0}
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          Create Template
        </button>
      </form>
      <ul className="space-y-2">
        {(templates || []).map((t: any) => {
          const ex = JSON.parse(t.exercisesJson || '[]')
          return (
            <li
              key={t.id}
              className="flex items-center justify-between rounded border border-slate-700 p-4"
            >
              <div>
                <h3 className="font-medium">{t.name}</h3>
                <p className="text-sm text-slate-400">
                  {ex.length} exercises
                </p>
              </div>
              <button
                onClick={() => remove.mutate(t.id)}
                className="rounded bg-red-600/30 px-2 py-1 text-sm text-red-400 hover:bg-red-600/50"
              >
                Delete
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
