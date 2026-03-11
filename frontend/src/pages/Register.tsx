import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api/client'
import { useAuthStore } from '../stores/authStore'
import AnimatedLoader from '../components/AnimatedLoader'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const register = useMutation({
    mutationFn: async () => {
      const { data } = await api.post('/auth/register', {
        email,
        password,
        displayName,
      })
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
          register.mutate()
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
              <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400" />
              Create your training space
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Get started</h1>
            <p className="muted mt-1 text-sm">
              Templates, PRs, measurements, and real-time collaboration.
            </p>
          </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm text-slate-400">Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-0 placeholder:text-slate-500 focus:border-primary-400/50 focus:bg-white/7"
            required
          />
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
          <label className="mb-2 block text-sm text-slate-400">Password (min 8)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 outline-none ring-0 placeholder:text-slate-500 focus:border-primary-400/50 focus:bg-white/7"
            required
          />
        </div>
        {register.isError && (
          <p className="mb-4 text-red-400">
            {(register.error as any)?.response?.data?.message || 'Registration failed'}
          </p>
        )}
        <button type="submit" disabled={register.isPending} className="shineButton w-full">
          {register.isPending ? 'Creating account…' : 'Register'}
        </button>
        {register.isPending && (
          <div className="mt-4">
            <AnimatedLoader label="Setting things up…" />
          </div>
        )}
        <p className="mt-4 text-center text-sm text-slate-400">
          Have an account?{' '}
          <Link to="/login" className="text-primary-300 hover:text-primary-200">
            Login
          </Link>
        </p>
        </div>
      </form>
    </div>
  )
}
