import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { generateSystemInstruction } from '../../../data/aiData'
import './ChatWidget.css'

const GROQ_API_URL   =  'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODEL     = 'llama-3.3-70b-versatile'
const MAX_HISTORY    = 20
const MAX_RETRIES    = 2
const RETRY_DELAY_MS = 800

const DEFAULT_W = 360
const DEFAULT_H = 390
const MIN_W     = 260
const MIN_H     = 260

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


function RobotFace({ size = 28 }) {
  return (
    <svg className="cw-robot-face" width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle className="cw-think-ring" cx="14" cy="14" r="14" fill="none" stroke="#09080a" strokeWidth="1.2" opacity="0" />
      <rect x="4"  y="7"  width="20" height="16" rx="4"   fill="#09080a" opacity="0.85" />
      <rect x="13" y="2"  width="2"  height="5"  rx="1"   fill="#09080a" opacity="0.75" />
      <circle cx="14" cy="2" r="1.5" fill="#09080a" opacity="0.9" />

      <rect className="cw-eye"        x="7.5"  y="11" width="5"   height="4.5" rx="1.5" fill="#F59E0B" />
      <rect                            x="8.5"  y="11.8" width="1.5" height="1.5" rx="0.5" fill="#FDE68A" opacity="0.7" />

      <rect className="cw-eye cw-eye-r" x="15.5" y="11" width="5"   height="4.5" rx="1.5" fill="#F59E0B" />
      <rect                            x="16.5" y="11.8" width="1.5" height="1.5" rx="0.5" fill="#FDE68A" opacity="0.7" />

      <circle cx="11" cy="19.5" r="1"   fill="#F59E0B" opacity="0.8" />
      <circle cx="14" cy="19.5" r="1.1" fill="#F59E0B" />
      <circle cx="17" cy="19.5" r="1"   fill="#F59E0B" opacity="0.8" />

      <rect x="2.5" y="12" width="1.5" height="3" rx="0.75" fill="#09080a" opacity="0.6" />
      <rect x="24"  y="12" width="1.5" height="3" rx="0.75" fill="#09080a" opacity="0.6" />
    </svg>
  )
}


function MiniRobot({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="3"  y="6"  width="16" height="13" rx="3.5" fill="#09080a" opacity="0.85" />
      <rect x="10" y="2"  width="2"  height="4"  rx="1"   fill="#09080a" opacity="0.75" />
      <circle cx="11" cy="2" r="1.2" fill="#09080a" opacity="0.9" />
      <rect x="5.5"  y="9.5" width="4" height="3.5" rx="1.2" fill="#F59E0B" />
      <rect x="12.5" y="9.5" width="4" height="3.5" rx="1.2" fill="#F59E0B" />
      <circle cx="8.5"  cy="15.5" r="0.9" fill="#F59E0B" opacity="0.8" />
      <circle cx="11"   cy="15.5" r="0.9" fill="#F59E0B" />
      <circle cx="13.5" cy="15.5" r="0.9" fill="#F59E0B" opacity="0.8" />
    </svg>
  )
}


function ExpandIcon({ compress = false }) {
  return compress ? (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M8 3v5H3M21 8h-5V3M16 21v-5h5M3 16h5v5"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}


const HANDLES = [
  { cls: 'cw-resize-edge cw-re-n',  dir: 'n'  },
  { cls: 'cw-resize-edge cw-re-s',  dir: 's'  },
  { cls: 'cw-resize-edge cw-re-e',  dir: 'e'  },
  { cls: 'cw-resize-edge cw-re-w',  dir: 'w'  },
  { cls: 'cw-resize-corner cw-rc-nw', dir: 'nw' },
  { cls: 'cw-resize-corner cw-rc-ne', dir: 'ne' },
  { cls: 'cw-resize-corner cw-rc-sw', dir: 'sw' },
  { cls: 'cw-resize-corner cw-rc-se', dir: 'se' },
]

export default function ChatWidget() {
  const [open,       setOpen]       = useState(false)
  const [messages,   setMessages]   = useState([INITIAL_MESSAGE])
  const [input,      setInput]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const [fullscreen, setFullscreen] = useState(false)


  const [geom, setGeom] = useState(null)


  const [fabY, setFabY] = useState(null)
  const fabDragging    = useRef(false)
  const fabDragStartY  = useRef(0)
  const fabDragStartFY = useRef(0)
  const btnRef         = useRef(null)

  const historyRef  = useRef([])
  const chatBodyRef = useRef(null)
  const bottomRef   = useRef(null)
  const sendingRef  = useRef(false)
  const inputRef    = useRef(null)

  const systemInstruction = useMemo(() => generateSystemInstruction(), [])


  useEffect(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w  = Math.min(DEFAULT_W, vw - 80)
    const h  = Math.min(DEFAULT_H, vh - 80)
    setGeom({
      left: vw - w - 76,
      top:  Math.max(8, vh / 2 - h / 2),
      w, h,
    })
    const minY = vh * 0.20
    const maxY = vh * 0.80 - 44
    setFabY(Math.max(minY, Math.min(maxY, vh / 2 - 22)))
  }, [])


  const scrollToBottom = useCallback((force = false) => {
    const el = chatBodyRef.current
    if (!el) return
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80
    if (force || atBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, loading, scrollToBottom])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])


  const onFabPointerDown = useCallback((e) => {
    fabDragging.current    = false
    fabDragStartY.current  = e.clientY
    fabDragStartFY.current = fabY ?? (window.innerHeight / 2 - 22)

    const onMove = (me) => {
      const delta = me.clientY - fabDragStartY.current
      if (Math.abs(delta) > 4) fabDragging.current = true
      const minY = window.innerHeight * 0.20
      const maxY = window.innerHeight * 0.80 - 44
      setFabY(Math.max(minY, Math.min(maxY, fabDragStartFY.current + delta)))
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
  }, [fabY])

  const handleFabClick = useCallback(() => {
    if (fabDragging.current) return
    setOpen((o) => !o)
    if (fullscreen) setFullscreen(false)
  }, [fullscreen])


  const onResizePointerDown = useCallback((e, dir) => {
    e.stopPropagation()
    e.preventDefault()

    const startX = e.clientX
    const startY = e.clientY
    const startG = { ...geom }

    const onMove = (me) => {
      const dx = me.clientX - startX
      const dy = me.clientY - startY
      const vw = window.innerWidth
      const vh = window.innerHeight

      let { left, top, w, h } = startG


      if (dir.includes('n')) {
        const newTop = top + dy
        const newH   = h - dy
        if (newH >= MIN_H) { top = newTop; h = newH }
      }

      if (dir.includes('s')) {
        h = Math.max(MIN_H, h + dy)
      }

      if (dir.includes('e')) {
        w = Math.max(MIN_W, w + dx)
      }

      if (dir.includes('w')) {
        const newLeft = left + dx
        const newW    = w - dx
        if (newW >= MIN_W) { left = newLeft; w = newW }
      }


      left = Math.max(0, Math.min(vw - MIN_W, left))
      top  = Math.max(0, Math.min(vh - MIN_H, top))
      w    = Math.min(w, vw - left)
      h    = Math.min(h, vh - top)

      setGeom({ left, top, w, h })
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup',   onUp)
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup',   onUp)
  }, [geom])


  const toggleFullscreen = useCallback(() => setFullscreen((f) => !f), [])


  const callGroq = useCallback(async (history, attempt = 0) => {
    const key = import.meta.env.VITE_APP_GROQ_API_KEY
    if (!key) throw Object.assign(new Error('API key missing'), { status: 401 })

    const response = await fetch(GROQ_API_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemInstruction }, ...history],
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


  const fabTop = fabY ?? (window.innerHeight / 2 - 22)

  const panelStyle = fullscreen
    ? {}
    : geom
      ? { left: geom.left, top: geom.top, width: geom.w, height: geom.h }
      : { right: '4.75rem', top: '50%', transform: 'translateY(-50%)', width: DEFAULT_W, height: DEFAULT_H }

  if (!geom) return null

  return (
    <>

      {open && (
        <div
          className={`cw-panel${fullscreen ? ' cw-fullscreen' : ''}`}
          style={panelStyle}
          role="dialog"
          aria-label="Chat with Ravi's AI"
        >

          <div className="cw-header">
            <div className="cw-avatar"><MiniRobot size={22} /></div>
            <div className="cw-header-info">
              <div className="cw-header-name">Ravi's AI Assistant</div>
              <div className="cw-header-status">
                <span className="cw-dot" />
                {loading ? 'Thinking…' : 'Online'}
              </div>
            </div>
            <div className="cw-header-btns">
              <button className="cw-icon-btn" onClick={toggleFullscreen}
                aria-label={fullscreen ? 'Restore size' : 'Fullscreen'} title={fullscreen ? 'Restore' : 'Fullscreen'}>
                <ExpandIcon compress={fullscreen} />
              </button>
              <button className="cw-icon-btn" onClick={() => { setOpen(false); setFullscreen(false) }} aria-label="Close chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>


          <div className="cw-messages" ref={chatBodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`cw-msg ${m.role}`}>
                <div className="cw-msg-avatar">
                  {m.role === 'bot'
                    ? <MiniRobot size={16} />
                    : <span className="cw-msg-avatar-label">You</span>}
                </div>
                <div className="cw-bubble">{m.text}</div>
              </div>
            ))}

            {loading && (
              <div className="cw-msg bot">
                <div className="cw-msg-avatar"><MiniRobot size={16} /></div>
                <div className="cw-bubble">
                  <div className="cw-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} style={{ height: 1, flexShrink: 0 }} aria-hidden="true" />
          </div>


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
            <button type="button" className="cw-send"
              onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>


          {HANDLES.map(({ cls, dir }) => (
            <div
              key={dir}
              className={cls}
              onPointerDown={(e) => onResizePointerDown(e, dir)}
              aria-hidden="true"
            />
          ))}
        </div>
      )}


      <button
        ref={btnRef}
        className={`cw-fab ${open ? 'active' : ''} ${fullscreen && open ? 'cw-fab-hidden' : ''}`}
        style={{ top: fabTop }}
        onPointerDown={onFabPointerDown}
        onClick={handleFabClick}
        aria-label="Toggle AI chat"
        title="Chat with Ravi's AI"
      >
        <RobotFace size={28} />
      </button>
    </>
  )
}
