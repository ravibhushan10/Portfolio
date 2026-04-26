import { useEffect, useRef } from 'react'
import './Experience.css'

const ITEMS = [
  {
    type: 'amber',
    role: 'Full-Stack Developer (Freelance)',
    org: 'Self-employed · Remote, India',
    period: '2024 – Present',
    periodStyle: 'amber',
    points: [
      'Built full-stack portfolio with MERN stack, AI chat widget, Cloudinary media, admin panel',
      'Deployed on AWS with JWT auth, Redis caching, Nodemailer notifications, rate limiting',
      'Implemented real-time features with Socket.io and secured REST APIs with bcrypt + JWT',
    ],
    tags: ['React', 'Node.js', 'MongoDB', 'AWS', 'Redis', 'TypeScript', 'Socket.io'],
  },
  {
    type: 'amber',
    role: 'MERN Chat Application',
    org: 'Personal Project · 2024',
    period: 'Project',
    periodStyle: 'amber',
    points: [
      'Real-time one-to-one messaging with Socket.io, online presence & read receipts',
      'JWT authentication, bcrypt password hashing, protected route middleware',
    ],
    tags: ['Socket.io', 'Express', 'MongoDB', 'JWT', 'bcrypt', 'React'],
  },
  {
    type: 'blue',
    role: 'B.Tech — Computer Science & Engineering',
    org: 'CT Institute of Engineering · Jalandhar, Punjab',
    period: '2023 – 2027',
    periodStyle: 'blue',
    points: [
      'Current CGPA: 7.5 / 10 — coursework in DSA, OS, DBMS, Computer Networks',
      'Active in open source contributions and developer communities',
    ],
    tags: ['CGPA 7.5', 'DSA', 'OS', 'DBMS', 'Networks', 'C++'],
  },
  {
    type: 'hollow',
    role: 'Your next role here',
    org: 'Open to opportunities · Anywhere',
    period: '2025+',
    periodStyle: 'gray',
    points: [],
    tags: ["Hiring?", "Let's connect"],
  },
]

export default function Experience() {
  const itemRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('exp-item--visible')
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    itemRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience" className="exp-section">
      <div className="section-wrap">
        <div className="exp-header">
          <h2 className="section-title">My Journey</h2>
          <p className="section-sub">Projects, education and what's next.</p>
        </div>

        <div className="exp-timeline">
          <div className="exp-spine" />

          {ITEMS.map((item, i) => (
            <div
              key={i}
              className={`exp-item exp-item--${item.type}`}
              ref={(el) => (itemRefs.current[i] = el)}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {item.type === 'amber' && <div className="exp-pulse-ring" />}
              <div className={`exp-dot exp-dot--${item.type}`} />
              <div className="exp-connector" />

              <div className={`exp-card exp-card--${item.type}`}>
                {item.type !== 'hollow' && (
                  <div className={`exp-topbar exp-topbar--${item.type}`} />
                )}
                <div className="exp-row">
                  <div className="exp-role">{item.role}</div>
                  <span className={`exp-badge exp-badge--${item.periodStyle}`}>{item.period}</span>
                </div>
                <div className="exp-org">{item.org}</div>

                {item.points.length > 0 && (
                  <ul className="exp-points">
                    {item.points.map((pt, j) => (
                      <li key={j} className="exp-point">{pt}</li>
                    ))}
                  </ul>
                )}

                <div className="exp-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="exp-tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
