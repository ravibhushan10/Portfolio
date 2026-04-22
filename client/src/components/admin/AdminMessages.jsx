import { useState, useEffect, useCallback } from 'react'
import {
  Mail, MailOpen, Star, Trash2, ChevronDown,
  ChevronUp, Search, RefreshCw, StickyNote,
  MessageSquare, Inbox, CheckCircle2, AlertCircle
} from 'lucide-react'

export default function AdminMessages({ authFetch }) {
  const [messages,  setMessages]  = useState([])
  const [stats,     setStats]     = useState({ total: 0, unread: 0, starred: 0 })
  const [loading,   setLoading]   = useState(true)
  const [search,    setSearch]    = useState('')
  const [filter,    setFilter]    = useState('all')
  const [expanded,  setExpanded]  = useState(null)
  const [noteEdit,  setNoteEdit]  = useState({})
  const [noteSaved, setNoteSaved] = useState({})
  const [page,      setPage]      = useState(1)
  const [total,     setTotal]     = useState(0)
  const [refreshing, setRefreshing] = useState(false)
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

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchMessages(), fetchStats()])
    setRefreshing(false)
  }

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

  const saveNote = async id => {
    await authFetch(`/contacts/${id}`, {
      method : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ adminNote: noteEdit[id] ?? '' }),
    })
    setNoteSaved(n => ({ ...n, [id]: true }))
    setTimeout(() => setNoteSaved(n => ({ ...n, [id]: false })), 2000)
    fetchMessages()
  }

  const deleteMsg = async id => {
    if (!window.confirm('Delete this message? This cannot be undone.')) return
    await authFetch(`/contacts/${id}`, { method: 'DELETE' })
    fetchMessages(); fetchStats()
  }

  const expand = msg => {
    setExpanded(e => e === msg._id ? null : msg._id)
    if (!msg.isRead) {
      authFetch(`/contacts/${msg._id}`, {
        method : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ isRead: true }),
      }).then(() => { fetchMessages(); fetchStats() })
    }
  }

  const fmt = d => new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })

  const getInitials = name =>
    name?.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

  const getAvatarColor = name => {
    const colors = [
      '#f59e0b','#10b981','#3b82f6','#8b5cf6',
      '#ec4899','#06b6d4','#f97316','#84cc16'
    ]
    let hash = 0
    for (const c of (name || '')) hash = c.charCodeAt(0) + ((hash << 5) - hash)
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="admin-tab-content">

      {/* Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(100,116,139,.12)', color: '#94a3b8' }}>
            <Inbox size={16} />
          </div>
          <div>
            <div className="admin-stat-num">{stats.total}</div>
            <div className="admin-stat-label">Total</div>
          </div>
        </div>
        <div className="admin-stat-card highlight">
          <div className="admin-stat-icon" style={{ background: 'var(--a-mist)', color: 'var(--a)' }}>
            <Mail size={16} />
          </div>
          <div>
            <div className="admin-stat-num">{stats.unread}</div>
            <div className="admin-stat-label">Unread</div>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon" style={{ background: 'rgba(234,179,8,.1)', color: '#eab308' }}>
            <Star size={16} />
          </div>
          <div>
            <div className="admin-stat-num">{stats.starred}</div>
            <div className="admin-stat-label">Starred</div>
          </div>
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
              {f === 'unread' && stats.unread > 0 && (
                <span className="admin-filter-badge">{stats.unread}</span>
              )}
            </button>
          ))}
        </div>
        <button
          className={`admin-icon-btn ${refreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          title="Refresh"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages */}
      {loading ? (
        <div className="admin-loading">
          <span className="admin-spinner-lg" />
          <span>Loading messages…</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="admin-empty">
          <MessageSquare size={32} strokeWidth={1} />
          <p>No messages found</p>
        </div>
      ) : (
        <div className="admin-msg-list">
          {messages.map(msg => (
            <div key={msg._id}
              className={`admin-msg-item ${!msg.isRead ? 'unread' : ''} ${expanded === msg._id ? 'open' : ''}`}
            >
              {/* Row */}
              <div className="admin-msg-row" onClick={() => expand(msg)}>

                {/* Unread dot */}
                <div className={`admin-msg-dot ${!msg.isRead ? 'active' : ''}`} />

                {/* Avatar */}
                <div className="admin-msg-avatar"
                  style={{ background: getAvatarColor(msg.fullName) }}>
                  {getInitials(msg.fullName)}
                </div>

                {/* Meta */}
                <div className="admin-msg-meta">
                  <span className="admin-msg-name">{msg.fullName}</span>
                  <span className="admin-msg-email">{msg.email}</span>
                </div>

                {/* Subject */}
                <div className="admin-msg-subject-wrap">
                  <span className={`admin-msg-subject ${!msg.isRead ? 'bold' : ''}`}>
                    {msg.subject}
                  </span>
                  {msg.adminNote && (
                    <span className="admin-msg-has-note" title="Has note">
                      <StickyNote size={10} />
                    </span>
                  )}
                </div>

                {/* Date */}
                <div className="admin-msg-date">{fmt(msg.createdAt)}</div>

                {/* Actions */}
                <div className="admin-msg-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className={`admin-icon-btn ${msg.isStarred ? 'starred' : ''}`}
                    onClick={() => toggleStar(msg)}
                    title={msg.isStarred ? 'Unstar' : 'Star'}
                  >
                    <Star size={13} fill={msg.isStarred ? 'currentColor' : 'none'} />
                  </button>
                  <button className="admin-icon-btn" onClick={() => toggleRead(msg)}
                    title={msg.isRead ? 'Mark unread' : 'Mark read'}>
                    {msg.isRead ? <MailOpen size={13} /> : <Mail size={13} />}
                  </button>
                  <button className="admin-icon-btn danger" onClick={() => deleteMsg(msg._id)} title="Delete">
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="admin-msg-chevron">
                  {expanded === msg._id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                </div>
              </div>

              {/* Expanded */}
              {expanded === msg._id && (
                <div className="admin-msg-body">

                  {/* Message bubble */}
                  <div className="admin-msg-bubble-wrap">
                    <div className="admin-msg-bubble-avatar"
                      style={{ background: getAvatarColor(msg.fullName) }}>
                      {getInitials(msg.fullName)}
                    </div>
                    <div className="admin-msg-bubble">
                      <div className="admin-msg-bubble-header">
                        <span className="admin-msg-bubble-name">{msg.fullName}</span>
                        {msg.phone && <span className="admin-msg-bubble-phone">{msg.phone}</span>}
                      </div>
                      <div className="admin-msg-full-text">{msg.message}</div>
                    </div>
                  </div>

                  {/* Note + Reply row */}
                  <div className="admin-msg-footer-row">
                    <div className="admin-msg-note-wrap">
                      <div className="admin-note-header">
                        <StickyNote size={11} />
                        <span>Private note</span>
                      </div>
                      <div className="admin-note-input-row">
                        <textarea
                          className="admin-note-input"
                          placeholder="Add a private note about this message…"
                          rows={2}
                          value={noteEdit[msg._id] ?? msg.adminNote ?? ''}
                          onChange={e => setNoteEdit(n => ({ ...n, [msg._id]: e.target.value }))}
                        />
                        <button
                          className={`admin-note-save ${noteSaved[msg._id] ? 'saved' : ''}`}
                          onClick={() => saveNote(msg._id)}
                        >
                          {noteSaved[msg._id]
                            ? <><CheckCircle2 size={12} /> Saved!</>
                            : 'Save'}
                        </button>
                      </div>
                    </div>

                    <a
                      href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                      className="admin-reply-btn"
                      target="_blank" rel="noopener noreferrer"
                    >
                      Reply via Gmail →
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {total > LIMIT && (
        <div className="admin-pagination">
          <button className="admin-page-btn" disabled={page === 1}
            onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span className="admin-page-info">Page {page} of {Math.ceil(total / LIMIT)}</span>
          <button className="admin-page-btn" disabled={page >= Math.ceil(total / LIMIT)}
            onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>
      )}
    </div>
  )
}
