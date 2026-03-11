import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../api/client'

export default function NewWorkout() {
  const [templateId, setTemplateId] = useState('')
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const { data: templates } = useQuery({
    queryKey: ['templates'],
    queryFn: () => api.get('/templates').then((r) => r.data),
  })

  const create = useMutation({
    mutationFn: () =>
      api.post('/workouts', { templateId: templateId || undefined, notes }),
    onSuccess: (res) => {
      navigate(`/workouts/${(res as any).data.id}`)
    },
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Workout</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          create.mutate()
        }}
        className="max-w-md space-y-4"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-400">
            Template (optional)
          </label>
          <select
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
          >
            <option value="">None</option>
            {(templates || []).map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-400">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
            rows={2}
          />
        </div>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          {create.isPending ? 'Starting...' : 'Start Workout'}
        </button>
      </form>
    </div>
  )
}
