import { useEffect, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { io } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000'

export function useWorkoutSocket() {
  const qc = useQueryClient()
  const socketRef = useRef<ReturnType<typeof io> | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    const base = WS_URL.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:')
    const socket = io(base, {
      path: '/ws',
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    socketRef.current = socket

    socket.on('workout:created', () => {
      qc.invalidateQueries({ queryKey: ['workouts'] })
    })

    socket.on('workout:updated', () => {
      qc.invalidateQueries({ queryKey: ['workouts'] })
    })

    socket.on('set:added', (data: any) => {
      if (data?.workoutId) {
        qc.invalidateQueries({ queryKey: ['workout-sets', data.workoutId] })
      }
    })

    socket.on('set:updated', (data: any) => {
      if (data?.workoutId) {
        qc.invalidateQueries({ queryKey: ['workout-sets', data.workoutId] })
      }
    })

    socket.on('set:completed', (data: any) => {
      if (data?.workoutId) {
        qc.invalidateQueries({ queryKey: ['workout-sets', data.workoutId] })
      }
    })

    socket.on('session:set:completed', () => {
      qc.invalidateQueries({ queryKey: ['workout-sets'] })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [qc])
}
