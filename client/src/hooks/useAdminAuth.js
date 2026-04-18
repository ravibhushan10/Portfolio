import { useState, useEffect, useCallback } from 'react'

const TOKEN_KEY = 'portfolio_admin_token'
const API       = import.meta.env.VITE_API_URL

export function useAdminAuth() {
  const [token,       setToken]       = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [isVerifying, setIsVerifying] = useState(true)
  const [isAuthed,    setIsAuthed]    = useState(false)

  // Verify token on mount
  useEffect(() => {
    if (!token) { setIsVerifying(false); return }
    fetch(`${API}/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        setIsAuthed(data.success)
        if (!data.success) {
          localStorage.removeItem(TOKEN_KEY)
          setToken('')
        }
      })
      .catch(() => { setIsAuthed(false) })
      .finally(() => setIsVerifying(false))
  }, [])  // eslint-disable-line

  const login = useCallback(async (password) => {
    const res  = await fetch(`${API}/admin/login`, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Login failed')

    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setIsAuthed(true)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken('')
    setIsAuthed(false)
  }, [])

 const authFetch = useCallback(async (path, options = {}) => {
  const isFormData = options.body instanceof FormData

  const res = await fetch(`${API}/admin${path}`, {
    ...options,
    headers: {
      // Only set Content-Type for JSON — never for FormData
      ...(!isFormData && options.headers ? options.headers : {}),
      Authorization: `Bearer ${token}`,
    },
  })
  if (res.status === 401) { logout(); throw new Error('Session expired') }
  return res
}, [token, logout])

  return { isVerifying, isAuthed, token, login, logout, authFetch }
}
