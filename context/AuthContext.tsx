import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'
import { AuthUser, AuthContextValue } from '../types'
import * as api from '../api/auth'

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // On mount: restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memento_token')
    if (saved) {
      api
        .getMe()
        .then((u) => {
          setToken(saved)
          setUser(u)
        })
        .catch(() => localStorage.removeItem('memento_token'))
        .finally(() => setIsLoading(false))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const t = await api.login(email, password)
    localStorage.setItem('memento_token', t)
    setToken(t)
    const u = await api.getMe()
    setUser(u)
  }, [])

  const register = useCallback(
    async (email: string, username: string, password: string) => {
      await api.register(email, username, password)
      await login(email, password)
    },
    [login],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('memento_token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
