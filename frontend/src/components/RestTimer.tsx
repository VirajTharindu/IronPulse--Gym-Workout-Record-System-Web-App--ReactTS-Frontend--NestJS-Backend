import { useState, useEffect } from 'react'

const DEFAULT_SECONDS = 90

export default function RestTimer() {
  const [seconds, setSeconds] = useState(0)
  const [duration, setDuration] = useState(DEFAULT_SECONDS)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    if (!isRunning || seconds <= 0) return
    const t = setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [isRunning, seconds])

  const start = () => {
    setSeconds(duration)
    setIsRunning(true)
  }

  const stop = () => setIsRunning(false)

  const m = Math.floor(seconds / 60)
  const s = seconds % 60

  return (
    <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-4">
      <h3 className="mb-3 text-sm font-medium text-slate-400">Rest Timer</h3>
      <div className="flex items-center gap-4">
        <div className="text-3xl font-mono font-bold">
          {isRunning ? `${m}:${s.toString().padStart(2, '0')}` : '--:--'}
        </div>
        <div className="flex gap-2">
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isRunning}
            className="rounded border border-slate-600 bg-slate-700 px-2 py-1"
          >
            {[30, 60, 90, 120, 180].map((n) => (
              <option key={n} value={n}>
                {n}s
              </option>
            ))}
          </select>
          <button
            onClick={start}
            disabled={isRunning}
            className="rounded bg-primary-500 px-3 py-1 text-sm font-medium hover:bg-primary-600 disabled:opacity-50"
          >
            Start
          </button>
          <button
            onClick={stop}
            disabled={!isRunning}
            className="rounded bg-slate-600 px-3 py-1 text-sm hover:bg-slate-500 disabled:opacity-50"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  )
}
