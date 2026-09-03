import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { tokenStore } from '../services/apiClient'
import { fetchCurrentUser, login as loginRequest, logout as logoutRequest, register as registerRequest } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState('loading') // loading | authenticated | guest

  const loadUser = useCallback(async () => {
    if (!tokenStore.get()) {
      setStatus('guest')
      return
    }
    try {
      const data = await fetchCurrentUser()
      setUser(data)
      setStatus('authenticated')
    } catch {
      tokenStore.clear()
      setUser(null)
      setStatus('guest')
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const login = async (payload) => {
    const data = await loginRequest(payload)
    setUser(data?.user ?? data)
    setStatus('authenticated')
    return data
  }

  const register = async (payload) => {
    const data = await registerRequest(payload)
    setUser(data?.user ?? data)
    setStatus('authenticated')
    return data
  }

  const logout = async () => {
    await logoutRequest()
    setUser(null)
    setStatus('guest')
  }

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout, refresh: loadUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
