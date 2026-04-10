import { useEffect, useState } from 'react'
import { FaSun, FaMoon, FaUserCircle } from 'react-icons/fa'

const NAV_LINKS = [
  { id: 'home',     label: 'Home'     },
  { id: 'about',    label: 'About'    },
  { id: 'projects', label: 'Projects' },
  { id: 'skills',   label: 'Skills'   },
  { id: 'contact',  label: 'Contact'  },
]

export default function Navbar() {
  const [active,   setActive]   = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const [showTop,  setShowTop]  = useState(false)
  const [dark,     setDark]     = useState(true)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }),
      { threshold: 0.3, rootMargin: '-64px 0px 0px 0px' }
    )
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 12)
      setShowTop(window.scrollY > 480)
    }
    window.addEventListener('scroll', fn, { passive: true })
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const scrollTo = id => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' })
  }

  return (
    <>
      <nav className={"navbar" + (scrolled ? " scrolled" : "")}>
        <a href="#home" className="navbar-logo" onClick={e => { e.preventDefault(); scrollTo('home') }}>
          Ravi<span>.dev</span>
        </a>

        <div className="navbar-links">
          {NAV_LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={"#" + id}
              className={"navbar-link" + (active === id ? " active" : "")}
              onClick={e => { e.preventDefault(); scrollTo(id) }}
            >
              {label}
            </a>
          ))}
        </div>

        <div className="navbar-right">
          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? <FaSun size={15} /> : <FaMoon size={15} />}
          </button>


        </div>
      </nav>

      <button
        className={"scroll-top-btn" + (showTop ? " visible" : "")}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </>
  )
}
