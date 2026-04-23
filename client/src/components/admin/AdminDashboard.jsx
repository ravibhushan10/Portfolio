import { useState } from 'react'
import '../../admin.css'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import AdminLogin    from './AdminLogin'
import AdminMessages from './AdminMessages'
import AdminProjects from './AdminProjects'
import {
  LayoutDashboard, MessageSquare, FolderKanban,
  LogOut, ExternalLink, Key
} from 'lucide-react'

const TABS = [
  { id: 'messages', label: 'Messages', icon: <MessageSquare size={15} /> },
  { id: 'projects', label: 'Projects', icon: <FolderKanban  size={15} /> },
]

export default function AdminDashboard() {
  const { isVerifying, isAuthed, login, logout, authFetch } = useAdminAuth()
  const [tab, setTab] = useState('messages')


  const [pwModal,  setPwModal]  = useState(false)
  const [pwForm,   setPwForm]   = useState({ currentPassword: '', newPassword: '' })
  const [pwMsg,    setPwMsg]    = useState('')
  const [pwLoading, setPwLoading] = useState(false)

  const handlePwChange = async e => {
    e.preventDefault()
    setPwLoading(true); setPwMsg('')
    try {
      const res  = await authFetch('/password', {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(pwForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setPwMsg('✅ Password changed!')
      setPwForm({ currentPassword: '', newPassword: '' })
    } catch (err) {
      setPwMsg('❌ ' + err.message)
    } finally {
      setPwLoading(false)
    }
  }

  if (isVerifying) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        height:'100vh', background:'#09090b', color:'#f59e0b', fontFamily:'monospace' }}>
        Verifying session…
      </div>
    )
  }

  if (!isAuthed) {
    return <AdminLogin onLogin={login} />
  }

  return (
    <div className="admin-shell">


      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <LayoutDashboard size={18} />
          <span>Portfolio Admin</span>
        </div>

        <nav className="admin-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-item">
            <ExternalLink size={15} /> View Portfolio
          </a>
          <button className="admin-nav-item" onClick={() => { setPwModal(true); setPwMsg('') }}>
            <Key size={15} /> Change Password
          </button>
          <button className="admin-nav-item danger" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>


      <main className="admin-main">
        <div className="admin-main-header">
          <h1 className="admin-main-title">
            {TABS.find(t => t.id === tab)?.label}
          </h1>
        </div>

        {tab === 'messages' && <AdminMessages authFetch={authFetch} />}
        {tab === 'projects' && <AdminProjects authFetch={authFetch} />}
      </main>


      {pwModal && (
        <div className="admin-modal-backdrop" onClick={() => setPwModal(false)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>Change Password</h2>
              <button className="admin-icon-btn" onClick={() => setPwModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePwChange} className="admin-modal-body">
              <div className="admin-form-group">
                <label className="admin-label">Current Password</label>
                <input className="admin-input" type="password"
                  value={pwForm.currentPassword}
                  onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                  required />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">New Password (min 8 chars)</label>
                <input className="admin-input" type="password"
                  value={pwForm.newPassword}
                  onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                  minLength={8} required />
              </div>
              {pwMsg && <p style={{ fontSize: 13, color: pwMsg.startsWith('✅') ? '#4ade80' : '#f87171' }}>{pwMsg}</p>}
              <div className="admin-modal-footer" style={{ paddingTop: 0 }}>
                <button type="button" className="admin-cancel-btn" onClick={() => setPwModal(false)}>Cancel</button>
                <button type="submit" className="admin-save-btn" disabled={pwLoading}>
                  {pwLoading ? 'Saving…' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
