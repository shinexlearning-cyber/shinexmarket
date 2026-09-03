import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RequireAuth({ children }) {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'loading') return null // app-shell splash already covers this
  if (status === 'guest') return <Navigate to="/login" state={{ from: location }} replace />

  return children
}
