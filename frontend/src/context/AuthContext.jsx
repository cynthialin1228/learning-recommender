import { createContext, useContext, useState } from 'react'
import api from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const email = localStorage.getItem('email')
    return token ? { token, email } : null
  })

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('email', res.data.email)
    setUser({ token: res.data.token, email: res.data.email })
  }

  const register = async (email, password) => {
    const res = await api.post('/api/auth/register', { email, password })
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('email', res.data.email)
    setUser({ token: res.data.token, email: res.data.email })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
