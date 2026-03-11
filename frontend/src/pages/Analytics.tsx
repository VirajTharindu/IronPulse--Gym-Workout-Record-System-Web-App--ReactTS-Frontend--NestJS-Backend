import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Analytics() {
  const { data: volume } = useQuery({
    queryKey: ['analytics', 'volume'],
    queryFn: () => api.get('/analytics/volume?days=30').then((r) => r.data),
  })

  const { data: prs } = useQuery({
    queryKey: ['analytics', 'prs'],
    queryFn: () => api.get('/analytics/personal-records').then((r) => r.data),
  })

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Analytics</h1>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-4 text-lg font-semibold">Volume Over Time (30 days)</h3>
          {volume?.length ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volume}>
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                  <Bar dataKey="volume" fill="#0ea5e9" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-slate-400">Complete sets to see volume data.</p>
          )}
        </div>
        <div className="rounded border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-4 text-lg font-semibold">Personal Records</h3>
          {prs?.length ? (
            <ul className="space-y-2">
              {prs.map((p: any) => (
                <li key={p.exerciseId} className="flex justify-between">
                  <span>{p.exerciseName}</span>
                  <span className="font-mono text-primary-400">
                    {p.weight} kg x {p.reps}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">Complete sets with weight to see PRs.</p>
          )}
        </div>
      </div>
    </div>
  )
}
