import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import WorkoutDetail from './pages/WorkoutDetail'
import NewWorkout from './pages/NewWorkout'
import Templates from './pages/Templates'
import Exercises from './pages/Exercises'
import Measurements from './pages/Measurements'
import Analytics from './pages/Analytics'
import Sharing from './pages/Sharing'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/workouts" element={<Workouts />} />
                  <Route path="/workouts/new" element={<NewWorkout />} />
                  <Route path="/workouts/:id" element={<WorkoutDetail />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/exercises" element={<Exercises />} />
                  <Route path="/measurements" element={<Measurements />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/sharing" element={<Sharing />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
