import { useEffect, useState, useRef } from 'react'
import { FaGithub, FaLinkedin, FaDownload, FaArrowRight, FaWhatsapp, FaTwitter, FaCode } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";



const SOCIALS = [
  { href: 'https://www.linkedin.com/in/ravibhushan-kumar-55b312344/', icon: <FaLinkedin />, label: 'LinkedIn' },
  { href: 'https://github.com/ravibhushan10',                         icon: <FaGithub />,  label: 'GitHub'   },
  { href: 'https://leetcode.com/u/ravibhushan54321/',                 icon: <SiLeetcode />,    label: 'LeetCode' },
  { href: 'https://x.com/Ravibhushan_12',                             icon: <FaXTwitter />, label: 'Twitter'  },
  { href: 'https://wa.me/919199519751',                               icon: <FaWhatsapp />,label: 'WhatsApp' },
]

const SPEED_CMD   = 70
const SPEED_FIELD = 55
function buildLines() {
  const raw = [
    { type: 'cmd',   prompt: '~/portfolio', cmd: 'cat profile.json' },
    { type: 'open',  text: '{' },
    { type: 'field', key: 'name',     val: '"Ravi Bhushan"',         color: 'str'  },
    { type: 'field', key: 'role',     val: '"Full-Stack Developer"',  color: 'str'  },
    { type: 'field', key: 'stack',    val: '"MERN + TypeScript"',     color: 'str'  },
    { type: 'field', key: 'location', val: '"Bihar, India"',           color: 'str'  },
    { type: 'field', key: 'status',   val: '"open_to_work": true',     color: 'bool' },
    { type: 'close', text: '}' },
    { type: 'spacer' },
    { type: 'cmd',   prompt: '~/portfolio', cmd: 'ls ./skills' },
    { type: 'tags',  items: ['React', 'Node.js', 'MongoDB', 'Express', 'TypeScript', 'Redis', 'AWS', 'Git'] },
    { type: 'spacer' },
    { type: 'cmd',   prompt: '~/portfolio', cmd: 'echo $CGPA' },
    { type: 'plain', text: '7.5/10  (B.Tech CSE, 2023-2027)' },
  ]

  let cursor = 400  // initial delay before first line
  return raw.map(line => {
    const out = { ...line, delay: cursor }
    if (line.type === 'cmd')   cursor += line.cmd.length * SPEED_CMD + 180
    else if (line.type === 'field') cursor += (`"${line.key}": ${line.val},`).length * SPEED_FIELD + 120
    else if (line.type === 'plain') cursor += line.text.length * SPEED_FIELD + 120
    else if (line.type === 'open' || line.type === 'close') cursor += 100
    else if (line.type === 'spacer') cursor += 150
    else if (line.type === 'tags')   cursor += line.items.length * 100 + 200
    return out
  })
}

const LINES = buildLines()

function TypedLine({ text, speed = 55, className = '', isTyping }) {
  const [displayed, setDisplayed] = useState('')
  const [localDone, setLocalDone] = useState(false)

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setLocalDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className={className}>
      {displayed}
      {isTyping && !localDone && <span className="t-cursor" />}
    </span>
  )
}

export default function Hero() {
  const [shownLines, setShownLines]       = useState([])
  const [typingLineIdx, setTypingLineIdx] = useState(null)
  const [allDone, setAllDone]             = useState(false)
   useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setShownLines(prev => [...prev, i])
        if (['cmd', 'field', 'plain'].includes(line.type)) {
          setTypingLineIdx(i)
        }
        if (i === LINES.length - 1) {
          const last = LINES[i]
          const text =
            last.type === 'cmd'   ? last.cmd :
            last.type === 'field' ? `"${last.key}": ${last.val},` :
            last.type === 'plain' ? last.text : ''
          const dur = text.length * (last.type === 'cmd' ? SPEED_CMD : SPEED_FIELD) + 300
          setTimeout(() => { setTypingLineIdx(null); setAllDone(true) }, dur)
        }
      }, line.delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-dotgrid" />
      <div className="hero-blob-1" />
      <div className="hero-blob-2" />

      <div className="hero-inner">

        <div className="hero-content">
          <h1 className="hero-headline">
            I build<br />
            things<br />
            for the <span className="accent-italic">web.</span>
          </h1>

          <p className="hero-sub">
            Hi — I'm <strong>Ravi Bhushan</strong>. I design and develop scalable web applications, from database systems to modern, accessible UIs.
          </p>

          <div className="hero-actions">

              <a href="#projects"
              className="btn btn-primary"
              onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              View My Work <FaArrowRight size={13} />
            </a>

              <a href="https://drive.google.com/drive/folders/1OSFRmCs_YnqQbGBi-nqJ5xlt5izLaAzt"
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <FaDownload size={12} /> Resume
            </a>
          </div>

          <span className="hero-sub">Connect with me</span>
          <div className="hero-socials">
            {SOCIALS.map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="hero-social-icon" aria-label={label}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* RIGHT: Terminal */}
          <div className="hero-terminal-wrap">
          <div className="terminal-card">
            <div className="terminal-topbar">
              <span className="terminal-dot" /><span className="terminal-dot" /><span className="terminal-dot" />
              <span className="terminal-title">ravi@portfolio — zsh</span>
            </div>
            <div className="terminal-body">
              {LINES.map((line, i) => {
                if (!shownLines.includes(i)) return null
                if (line.type === 'spacer') return <div key={i} className="t-spacer" />
                if (line.type === 'cmd') return (
                  <div key={i} className="t-line">
                    <span className="t-prompt">{line.prompt} <span className="t-chevron">❯</span></span>
                    <TypedLine text={line.cmd} speed={SPEED_CMD} className="t-cmd" isTyping={typingLineIdx === i} />
                  </div>
                )
                if (line.type === 'open') return (
                  <div key={i} className="t-line t-indent-1"><span className="t-dim">{line.text}</span></div>
                )
                if (line.type === 'close') return (
                  <div key={i} className="t-line t-indent-1"><span className="t-dim">{line.text}</span></div>
                )
                if (line.type === 'field') return (
                  <div key={i} className="t-line t-indent-2">
                    <TypedLine
                      text={`"${line.key}": ${line.val},`}
                      speed={SPEED_FIELD}
                      className={line.color === 'str' ? 't-field-str' : 't-field-bool'}
                      isTyping={typingLineIdx === i}
                    />
                  </div>
                )
                if (line.type === 'plain') return (
                  <div key={i} className="t-line">
                    <TypedLine text={line.text} speed={SPEED_FIELD} className="t-str" isTyping={typingLineIdx === i} />
                  </div>
                )
                if (line.type === 'tags') return (
                  <div key={i} className="t-tags-row">
                    {line.items.map((item, ti) => (
                      <span key={item} className="t-tag"
                        style={{ animationDelay: `${ti * 80}ms`, animation: 'fadeIn .3s ease both' }}>
                        {item}
                      </span>
                    ))}
                  </div>
                )
                return null
              })}
              {allDone && (
                <div className="t-line" style={{ marginTop: '.4rem' }}>
                  <span className="t-prompt">~/portfolio <span className="t-chevron">❯</span></span>
                  <span className="t-cursor" />
                </div>
              )}
            </div>
          </div>
          </div>

      </div>
    </section>
  )
}
