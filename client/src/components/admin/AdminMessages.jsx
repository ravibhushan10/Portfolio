import { useState, useEffect, useCallback } from 'react'
import {
  Mail, MailOpen, Star, Trash2, ChevronDown,
  ChevronUp, Search, RefreshCw, StickyNote
} from 'lucide-react'

export default function AdminMessages({ authFetch }) {
  const [messages,  setMessages]  = useState([])
  const [stats,     setStats]     = useState({ total: 0, unread: 0, starred: 0 })
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')   // all | unread | starred
  const [expanded,  setExpanded]  = useState(null)
  const [noteEdit,  setNoteEdit]  = useState({})      // { [id]: string }
  const [page,      setPage]      = useState(1)
  const [total,     setTotal]     = useState(0)
  const LIMIT = 15

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page, limit: LIMIT })
      if (filter === 'unread')  params.set('read',    'false')
      if (filter === 'starred') params.set('starred', 'true')
      if (search) params.set('search', search)

      const res  = await authFetch(`/contacts?${params}`)
      const data = await res.json()
      if (data.success) { setMessages(data.data); setTotal(data.total) }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [authFetch, page, filter, search])

  const fetchStats = useCallback(async () => {
    try {
      const res  = await authFetch('/contacts/stats')
      const data = await res.json()
      if (data.success) setStats(data.data)
    } catch {}
  }, [authFetch])

  useEffect(() => { fetchMessages(); fetchStats() }, [fetchMessages, fetchStats])

  const toggleRead = async msg => {
    await authFetch(`/contacts/${msg._id}`, {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ isRead: !msg.isRead }),
    })
    fetchMessages(); fetchStats()
  }

  const toggleStar = async msg => {
    await authFetch(`/contacts/${msg._id}`, {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ isStarred: !msg.isStarred }),
    })
    fetchMessages(); fetchStats()
  }

  const saveNote = async (id) => {
    await authFetch(`/contacts/${id}`, {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ adminNote: noteEdit[id] ?? '' }),
    })
    fetchMessages()
  }

  const deleteMsg = async id => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    await authFetch(`/contacts/${id}`, { method: 'DELETE' })
    fetchMessages(); fetchStats()
  }

  const expand = msg => {
    setExpanded(e => e === msg._id ? null : msg._id)
    // Mark as read when opened
    if (!msg.isRead) {
      authFetch(`/contacts/${msg._id}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ isRead: true }),
      }).then(() => { fetchMessages(); fetchStats() })
    }
  }

  const fmt = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div className="admin-tab-content">

      {/* Stats row */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-num">{stats.total}</div>
          <div className="admin-stat-label">Total</div>
        </div>
        <div className="admin-stat-card highlight">
          <div className="admin-stat-num">{stats.unread}</div>
          <div className="admin-stat-label">Unread</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-num">{stats.starred}</div>
          <div className="admin-stat-label">Starred</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={13} className="admin-search-icon" />
          <input
            className="admin-search"
            placeholder="Search name, email, subject…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <div className="admin-filter-tabs">
          {['all', 'unread', 'starred'].map(f => (
            <button key={f}
              className={`admin-filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => { setFilter(f); setPage(1) }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="admin-icon-btn" onClick={() => { fetchMessages(); fetchStats() }} title="Refresh">
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages list */}
      {loading ? (
        <div className="admin-loading">Loading messages…</div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">No messages found</div>
      ) : (
        <div className="admin-msg-list">
          {messages.map(msg => (
            <div key={msg._id}
              className={`admin-msg-item ${!msg.isRead ? 'unread' : ''} ${expanded === msg._id ? 'open' : ''}`}
            >
              {/* Row */}
              <div className="admin-msg-row" onClick={() => expand(msg)}>
                <div className="admin-msg-indicator" />
                <div className="admin-msg-meta">
                  <span className="admin-msg-name">{msg.fullName}</span>
                  <span className="admin-msg-email">{msg.email}</span>
                  {msg.phone && <span className="admin-msg-phone">{msg.phone}</span>}
                </div>
                <div className="admin-msg-subject">{msg.subject}</div>
                <div className="admin-msg-date">{fmt(msg.createdAt)}</div>
                <div className="admin-msg-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className={`admin-icon-btn ${msg.isStarred ? 'starred' : ''}`}
                    onClick={() => toggleStar(msg)}
                    title={msg.isStarred ? 'Unstar' : 'Star'}
                  >
                    <Star size={13} fill={msg.isStarred ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className="admin-icon-btn"
                    onClick={() => toggleRead(msg)}
                    title={msg.isRead ? 'Mark unread' : 'Mark read'}
                  >
                    {msg.isRead ? <MailOpen size={13} /> : <Mail size={13} />}
                  </button>
                  <button
                    className="admin-icon-btn danger"
                    onClick={() => deleteMsg(msg._id)}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="admin-msg-chevron">
                  {expanded === msg._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </div>
              </div>

              {/* Expanded body */}
              {expanded === msg._id && (
                <div className="admin-msg-body">
                  <div className="admin-msg-full-text">{msg.message}</div>
                  <div className="admin-msg-note-row">
                    <StickyNote size={12} />
                    <textarea
                      className="admin-note-input"
                      placeholder="Add a private note…"
                      rows={2}
                      value={noteEdit[msg._id] ?? msg.adminNote ?? ''}
                      onChange={e => setNoteEdit(n => ({ ...n, [msg._id]: e.target.value }))}
                    />
                    <button className="admin-note-save" onClick={() => saveNote(msg._id)}>Save</button>
                  </div>
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="admin-reply-btn"
                    target="_blank" rel="noopener noreferrer"
                  >
                    Reply via Gmail →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="admin-pagination">
          <button
            className="admin-page-btn"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >← Prev</button>
          <span className="admin-page-info">Page {page} of {Math.ceil(total / LIMIT)}</span>
          <button
            className="admin-page-btn"
            disabled={page >= Math.ceil(total / LIMIT)}
            onClick={() => setPage(p => p + 1)}
          >Next →</button>
        </div>
      )}
    </div>
  )
}
