import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuthStore } from '../stores/authStore'
import AnimatedLoader from '../components/AnimatedLoader'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const login = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/login', { email, password })
      return data
    },
    onSuccess: (data) => {
      setAuth(data.accessToken, data.user)
      navigate('/dashboard')
    },
  })

  return (
    <div className="appShell flex min-h-screen items-center justify-center px-4">
      <div className="noiseOverlay" />
      <form
        onSubmit={(e) => {
          e.preventDefault()
          login.mutate()
        }}
        className="glass relative w-full max-w-sm overflow-hidden rounded-2xl p-8"
      >
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-16 -bottom-16 h-44 w-44 rounded-full bg-fuchsia-500/20 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mb-6">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />IronPulse
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back
            </h1>
            <p className="muted mt-1 text-sm">
              Log sets fast, track PRs, and sync live.
            </p>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm text-slate-400">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-0 placeholder:text-slate-500 focus:border-primary-400/50 focus:bg-white/7"
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-0 placeholder:text-slate-500 focus:border-primary-400/50 focus:bg-white/7"
              required
            />
          </div>
          {login.isError && (
            <p className="mb-4 text-red-400">
              {(login.error as any)?.response?.data?.message || 'Login failed'}
            </p>
          )}
          <button type="submit" disabled={login.isPending} className="shineButton w-full">
            {login.isPending ? 'Signing in…' : 'Login'}
          </button>
          {login.isPending && (
            <div className="mt-4">
              <AnimatedLoader label="Verifying credentials…" />
            </div>
          )}
          <p className="mt-4 text-center text-sm text-slate-400">
            No account?{' '}
            <Link to="/register" className="text-primary-300 hover:text-primary-200">
              Register
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}
