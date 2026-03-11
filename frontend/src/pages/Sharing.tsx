import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { api } from '../api/client'

export default function Sharing() {
  const [resourceType, setResourceType] = useState<'workout' | 'template'>('workout')
  const [resourceId, setResourceId] = useState('')
  const [sharedWithId, setSharedWithId] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit'>('view')

  const { data: shared } = useQuery({
    queryKey: ['shares'],
    queryFn: () => api.get('/shares').then((r) => r.data),
  })

  const share = useMutation({
    mutationFn: () =>
      api.post('/shares', {
        resourceType,
        resourceId,
        sharedWithId,
        permission,
      }),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Sharing</h1>
      <div className="mb-8 max-w-md">
        <h3 className="mb-3 text-lg font-semibold">Share a resource</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            share.mutate()
          }}
          className="space-y-3"
        >
          <select
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value as any)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
          >
            <option value="workout">Workout</option>
            <option value="template">Template</option>
          </select>
          <input
            placeholder="Resource ID (workout or template ID)"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
          />
          <input
            placeholder="Share with user ID"
            value={sharedWithId}
            onChange={(e) => setSharedWithId(e.target.value)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
          />
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value as any)}
            className="w-full rounded border border-slate-600 bg-slate-700 px-3 py-2"
          >
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <button
            type="submit"
            disabled={share.isPending}
            className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
          >
            Share
          </button>
        </form>
      </div>
      <div>
        <h3 className="mb-3 text-lg font-semibold">Shared with me</h3>
        <ul className="space-y-2">
          {(shared || []).map((s: any) => (
            <li key={s.id} className="rounded border border-slate-700 p-3">
              {s.resourceType} {s.resourceId} - {s.permission}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
