import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { generateSystemInstruction } from '../../../data/aiData'
import './ChatWidget.css'

const GROQ_API_URL   = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL     = 'llama-3.3-70b-versatile'
const MAX_HISTORY    = 20
const MAX_RETRIES    = 2
const RETRY_DELAY_MS = 800

const uid   = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function classifyError(err, status) {
  if (!navigator.onLine) return { msg: 'No internet connection.', retry: false }
  if (status === 401)    return { msg: 'API key invalid. Contact the site owner.', retry: false }
  if (status === 429)    return { msg: 'Rate limit hit. Please wait a moment.', retry: true }
  if (status >= 500)     return { msg: 'Server error. Retrying…', retry: true }
  return { msg: 'Something went wrong. Please try again.', retry: false }
}

const INITIAL_MESSAGE = {
  id:   uid(),
  role: 'bot',
  text: "Hi! I'm Ravi's AI assistant. Ask me anything about his skills, projects, or experience!",
}

export default function ChatWidget() {
  const [open,    setOpen]    = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input,   setInput]   = useState('')
  const [loading, setLoading] = useState(false)

  // Drag state
  const [posY,    setPosY]    = useState(null) // null = default center
  const dragging  = useRef(false)
  const dragStartY = useRef(0)
  const dragStartPosY = useRef(0)
  const btnRef    = useRef(null)

  const historyRef  = useRef([])
  const chatBodyRef = useRef(null)
  const bottomRef   = useRef(null)
  const sendingRef  = useRef(false)
  const inputRef    = useRef(null)

  const systemInstruction = useMemo(() => generateSystemInstruction(), [])

useEffect(() => {
  const minY = window.innerHeight * 0.20
  const maxY = window.innerHeight * 0.80 - 39
  setPosY(Math.max(minY, Math.min(maxY, window.innerHeight / 2 - 24)))
}, [])

  // ── Auto scroll ──
  const scrollToBottom = useCallback((force = false) => {
    const el = chatBodyRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    if (force || atBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

 const onPointerDown = useCallback((e) => {
  dragging.current   = false
  dragStartY.current = e.clientY
  dragStartPosY.current = posY ?? (window.innerHeight / 2 - 24)

  const onMove = (me) => {
    const delta = me.clientY - dragStartY.current
    if (Math.abs(delta) > 4) dragging.current = true

    // ── Constrain to middle 40% (exclude top 30% and bottom 30%) ──
    const minY = window.innerHeight * 0.20          // 30% from top
    const maxY = window.innerHeight * 0.80 - 39     // 30% from bottom (minus btn height)

    const newY = Math.max(minY, Math.min(maxY, dragStartPosY.current + delta))
    setPosY(newY)
  }

  const onUp = () => {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup',   onUp)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup',   onUp)
}, [posY])

  const handleBtnClick = useCallback(() => {
    if (dragging.current) return // was dragged, not clicked
    setOpen((o) => !o)
  }, [])

  // ── Groq API ──
  const callGroq = useCallback(async (history, attempt = 0) => {
    const key = import.meta.env.VITE_APP_GROQ_API_KEY
    if (!key) throw Object.assign(new Error('API key missing'), { status: 401 })

    const response = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [{ role: 'system', content: systemInstruction }, ...history],
        temperature: 0.7,
        max_tokens:  300,
        stream:      false,
      }),
    })

    if (!response.ok) {
      const body = await response.json().catch(() => ({}))
      const err  = Object.assign(new Error(body?.error?.message || `HTTP ${response.status}`), { status: response.status })
      const { msg, retry } = classifyError(err, response.status)
      if (retry && attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS * (attempt + 1))
        return callGroq(history, attempt + 1)
      }
      throw Object.assign(err, { userMessage: msg })
    }

    const data  = await response.json()
    const reply = data.choices?.[0]?.message?.content?.trim()
    if (!reply) throw Object.assign(new Error('Empty response'), { userMessage: 'Got an empty reply. Please try again.' })
    return reply
  }, [systemInstruction])

  // ── Send ──
  const send = useCallback(async (overrideText) => {
    const msg = (overrideText ?? input).trim()
    if (!msg || sendingRef.current) return
    sendingRef.current = true

    setInput('')
    setMessages((prev) => [...prev, { id: uid(), role: 'user', text: msg }])
    setLoading(true)
    requestAnimationFrame(() => scrollToBottom(true))

    historyRef.current.push({ role: 'user', content: msg })
    if (historyRef.current.length > MAX_HISTORY)
      historyRef.current = historyRef.current.slice(-MAX_HISTORY)

    try {
      const reply = await callGroq(historyRef.current)
      historyRef.current.push({ role: 'assistant', content: reply })
      if (historyRef.current.length > MAX_HISTORY)
        historyRef.current = historyRef.current.slice(-MAX_HISTORY)
      setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: reply }])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages((prev) => [...prev, { id: uid(), role: 'bot', text: err.userMessage || 'Something went wrong. Please try again.' }])
      historyRef.current.pop()
    } finally {
      setLoading(false)
      sendingRef.current = false
    }
  }, [input, callGroq, scrollToBottom])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }, [send])

  // Panel vertical position — clamp so it doesn't go off screen
  const btnTop  = posY ?? (window.innerHeight / 2 - 24)
  // Panel opens to the left, vertically aligned to button
  const panelStyle = {
    top: Math.max(8, Math.min(window.innerHeight - 380, btnTop - 160)),
  }

  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div className="cw-panel" style={panelStyle} role="dialog" aria-label="Chat with Ravi's AI">
          {/* Header */}
          <div className="cw-header">
            <div className="cw-avatar">RB</div>
            <div className="cw-header-info">
              <div className="cw-header-name">Ravi's AI Assistant</div>
              <div className="cw-header-status">
                <span className="cw-dot" />
                Online
              </div>
            </div>
            <button className="cw-close-btn" onClick={() => setOpen(false)} aria-label="Close chat">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="cw-messages" ref={chatBodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`cw-msg ${m.role}`}>
                <div className="cw-msg-avatar">{m.role === 'bot' ? 'AI' : 'You'}</div>
                <div className="cw-bubble">{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="cw-msg bot">
                <div className="cw-msg-avatar">AI</div>
                <div className="cw-bubble">
                  <div className="cw-typing">
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} style={{ height: 1, flexShrink: 0 }} aria-hidden="true" />
          </div>

          {/* Input */}
          <div className="cw-input-row">
            <input
              ref={inputRef}
              className="cw-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about Ravi…"
              disabled={loading}
              autoComplete="off"
            />
            <button
              type="button"
              className="cw-send"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Draggable Chat Button */}
      <button
        ref={btnRef}
        className={`cw-fab ${open ? 'active' : ''}`}
        style={{ top: btnTop }}
        onPointerDown={onPointerDown}
        onClick={handleBtnClick}
        aria-label="Toggle AI chat"
        title="Chat with Ravi's AI"
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {/* Drag hint dots */}
        <span className="cw-drag-hint">
          <span /><span /><span /><span /><span /><span />
        </span>
      </button>
    </>
  )
}
