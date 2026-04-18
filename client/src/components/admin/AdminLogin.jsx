import { useState } from 'react'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setError('')
    try {
      await onLogin(password)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <Shield size={28} />
        </div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-sub">Enter your password to manage the portfolio</p>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-input-wrap">
            <Lock size={14} className="admin-input-icon" />
            <input
              type={show ? 'text' : 'password'}
              className="admin-input"
              placeholder="Admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button
              type="button"
              className="admin-input-eye"
              onClick={() => setShow(s => !s)}
              tabIndex={-1}
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !password.trim()}
          >
            {loading ? <span className="admin-spinner" /> : null}
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </form>

        <a href="/" className="admin-back-link">← Back to portfolio</a>
      </div>
    </div>
  )
}
