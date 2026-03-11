import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'

export default function Exercises() {
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState('')
  const [equipment, setEquipment] = useState('')
  const qc = useQueryClient()

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => api.get('/exercises').then((r) => r.data),
  })

  const add = useMutation({
    mutationFn: () =>
      api.post('/exercises', {
        name,
        muscleGroup,
        equipment,
        isCustom: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exercises'] })
      setName('')
      setMuscleGroup('')
      setEquipment('')
    },
  })

  if (isLoading) return <p className="text-slate-400">Loading...</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Exercise Library</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add.mutate()
        }}
        className="mb-8 flex flex-wrap gap-4"
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-slate-600 bg-slate-700 px-3 py-2"
          required
        />
        <input
          placeholder="Muscle group"
          value={muscleGroup}
          onChange={(e) => setMuscleGroup(e.target.value)}
          className="rounded border border-slate-600 bg-slate-700 px-3 py-2"
          required
        />
        <input
          placeholder="Equipment"
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="rounded border border-slate-600 bg-slate-700 px-3 py-2"
        />
        <button
          type="submit"
          disabled={add.isPending}
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          Add Exercise
        </button>
      </form>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(exercises || []).map((e: any) => (
          <li
            key={e.id}
            className="rounded border border-slate-700 p-3"
          >
            <h3 className="font-medium">{e.name}</h3>
            <p className="text-sm text-slate-400">
              {e.muscleGroup} · {e.equipment || '-'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
