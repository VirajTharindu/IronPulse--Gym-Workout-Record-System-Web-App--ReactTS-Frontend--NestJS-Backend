import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function Measurements() {
  const [type, setType] = useState('weight')
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('kg')
  const qc = useQueryClient()

  const { data: measurements } = useQuery({
    queryKey: ['measurements'],
    queryFn: () => api.get('/measurements').then((r) => r.data),
  })

  const add = useMutation({
    mutationFn: () =>
      api.post('/measurements', {
        type,
        value: parseFloat(value),
        unit,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['measurements'] })
      setValue('')
    },
  })

  const chartData = (measurements || [])
    .filter((m: any) => m.type === 'weight')
    .map((m: any) => ({
      date: new Date(m.recordedAt).toLocaleDateString(),
      value: parseFloat(m.value),
    }))
    .sort((a: any, b: any) => a.date.localeCompare(b.date))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Body Measurements</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add.mutate()
        }}
        className="mb-8 flex flex-wrap gap-4"
      >
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded border border-slate-600 bg-slate-700 px-3 py-2"
        >
          <option value="weight">Weight</option>
          <option value="body_fat">Body Fat %</option>
          <option value="muscle">Muscle</option>
          <option value="other">Other</option>
        </select>
        <input
          type="number"
          step="0.1"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-24 rounded border border-slate-600 bg-slate-700 px-3 py-2"
          required
        />
        <input
          placeholder="Unit (kg, %, etc)"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="w-20 rounded border border-slate-600 bg-slate-700 px-3 py-2"
        />
        <button
          type="submit"
          disabled={add.isPending}
          className="rounded bg-primary-500 px-4 py-2 font-medium hover:bg-primary-600 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {chartData.length > 0 && (
        <div className="mb-8 h-64 rounded border border-slate-700 bg-slate-800 p-4">
          <h3 className="mb-2 text-sm text-slate-400">Weight over time</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <ul className="space-y-2">
        {(measurements || []).map((m: any) => (
          <li key={m.id} className="rounded border border-slate-700 p-3">
            {m.type}: {m.value} {m.unit} - {new Date(m.recordedAt).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  )
}
