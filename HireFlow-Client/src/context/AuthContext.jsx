import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('hireflow_token')
  })

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('hireflow_user')

    if (!storedUser) {
      return null
    }

    try {
      return JSON.parse(storedUser)
    } catch {
      localStorage.removeItem('hireflow_user')
      return null
    }
  })

  const [loading, setLoading] = useState(false)

  const login = async (loginData) => {
    setLoading(true)

    try {
      const response = await authService.login(loginData)

      localStorage.setItem('hireflow_token', response.token)

      const userData = {
        userId: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
      }

      localStorage.setItem(
        'hireflow_user',
        JSON.stringify(userData),
      )

      setToken(response.token)
      setUser(userData)

      return response
    } finally {
      setLoading(false)
    }
  }

  const register = async (registerData) => {
    setLoading(true)

    try {
      return await authService.register(registerData)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('hireflow_token')
    localStorage.removeItem('hireflow_user')

    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    const handleUnauthorized = () => {
      logout()
    }

    window.addEventListener(
      'hireflow:unauthorized',
      handleUnauthorized,
    )

    return () => {
      window.removeEventListener(
        'hireflow:unauthorized',
        handleUnauthorized,
      )
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
    }),
    [user, token, loading],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    )
  }

  return context
}