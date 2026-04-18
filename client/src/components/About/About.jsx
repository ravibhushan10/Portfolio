import './About.css'

const STATS = [
  { num: '4+',  label: 'Projects'     },
  { num: '1+',  label: 'Yrs Coding'   },
  { num: '10+', label: 'Technologies' },
  { num: '7.5', label: 'CGPA / 10'    },
]

export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-wrap">

        {/* Header */}
        <div className="about-header">
          <h2 className="section-title">The Person Behind the Code</h2>
          <p className="section-sub">Passionate about building things that are fast, secure, and actually useful.</p>
        </div>

        <div className="about-grid">

          {/* ── Left: Photo only ── */}
          <div className="about-left">
            <div className="about-photo-frame">
              <img
                className="about-photo"
                src="https://d1jd6j7xdf8x95.cloudfront.net/images/profile_image.png"
                alt="Ravi Bhushan"
                loading="lazy"
              />
              {/* Decorative offset border */}
              <div className="about-photo-border" />
              {/* Badge */}
              <span className="about-photo-badge">Full-Stack · MERN</span>
              {/* Ambient glow */}
              <div className="about-photo-glow" />
            </div>
          </div>

          {/* ── Right: Bio + Stats ── */}
          <div className="about-right">

            {/* Bio */}
            <div className="about-bio-block">
              <p className="about-bio">
                I'm <strong>Ravi Bhushan</strong>, a B.Tech CSE student at CT Institute
                (2023–2027), based in Bihar, India. I specialise in the{' '}
                <strong>MERN stack</strong> — building secure auth systems, full-stack
                tools, and AI-powered applications.
              </p>
              <p className="about-bio" style={{ marginTop: '1rem' }}>
                I care deeply about <strong>clean code</strong>, real-world impact, and
                shipping products people actually love to use. Currently{' '}
                <strong className="about-open">open to opportunities</strong> — whether
                that's a role, a freelance project, or a cool collaboration.
              </p>

              {/* Subtle detail row */}
              <div className="about-meta">
                <span className="about-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Bihar, India
                </span>
                <span className="about-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  B.Tech CSE · 2023–2027
                </span>
                <span className="about-meta-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Open to Work
                </span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="about-stats">
              {STATS.map(({ num, label }) => (
                <div key={label} className="about-stat">
                  <div className="about-stat-num">{num}</div>
                  <div className="about-stat-label">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
