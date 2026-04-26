import { useEffect, useRef } from 'react'
import {
  SiReact, SiTypescript, SiJavascript, SiNodedotjs, SiExpress,
  SiMongodb, SiMysql, SiRedis, SiTailwindcss, SiHtml5,
  SiRedux, SiGit, SiGithub, SiLinux, SiDocker,
  SiPostman, SiCplusplus,
} from 'react-icons/si'
import { FaAws, FaCss3Alt, FaCode } from 'react-icons/fa'
import './Skills.css'

const COL_LEFT = [
  { name: 'React',       icon: <SiReact />,            color: '#61DAFB' },
  { name: 'TypeScript',  icon: <SiTypescript />,        color: '#3178C6' },
  { name: 'JavaScript',  icon: <SiJavascript />,        color: '#F7DF1E' },
  { name: 'Node.js',     icon: <SiNodedotjs />,         color: '#339933' },
  { name: 'Express',     icon: <SiExpress />,           color: '#888888' },
  { name: 'MongoDB',     icon: <SiMongodb />,           color: '#47A248' },
  { name: 'Tailwind',    icon: <SiTailwindcss />,       color: '#06B6D4' },
  { name: 'Redux',       icon: <SiRedux />,             color: '#764ABC' },
  { name: 'HTML5',       icon: <SiHtml5 />,             color: '#E34F26' },
  { name: 'CSS3',        icon: <FaCss3Alt />,              color: '#1572B6' },
]

const COL_RIGHT = [
  { name: 'AWS',         icon: <FaAws />, color: '#FF9900' },
  { name: 'Docker',      icon: <SiDocker />,            color: '#2496ED' },
  { name: 'Git',         icon: <SiGit />,               color: '#F05032' },
  { name: 'GitHub',      icon: <SiGithub />,            color: '#aaaaaa' },
  { name: 'Linux',       icon: <SiLinux />,             color: '#FCC624' },
  { name: 'MySQL',       icon: <SiMysql />,             color: '#4479A1' },
  { name: 'Redis',       icon: <SiRedis />,             color: '#DC382D' },
  { name: 'Postman',     icon: <SiPostman />,           color: '#FF6C37' },
  { name: 'C / C++',     icon: <SiCplusplus />,         color: '#A8B9CC' },
  { name: 'VS Code',     icon: <FaCode />,  color: '#007ACC' },
]

function InfiniteCol({ items, colRef }) {
  return (
    <div className="sk-col-window">
      <div className="sk-col-fade sk-col-fade--top" />
      <div className="sk-col-fade sk-col-fade--bot" />
      <div className="sk-col-track" ref={colRef}>
        {[...items, ...items].map((skill, i) => (
          <div className="sk-card" key={i}>
            <span className="sk-icon" style={{ color: skill.color }}>{skill.icon}</span>
            <span className="sk-name">{skill.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const col1Ref = useRef(null)
  const col2Ref = useRef(null)
  const animRef = useRef(null)
  const pos1    = useRef(0)
  const pos2    = useRef(0)

useEffect(() => {
  const SPEED = 0.55
  function tick() {
    const c1 = col1Ref.current
    const c2 = col2Ref.current
    if (!c1 || !c2) return
    const half1 = c1.scrollHeight / 2
    const half2 = c2.scrollHeight / 2
    // init right col mid-way so it is never empty at start
    if (pos2.current === null) pos2.current = -half2 / 2
    pos1.current -= SPEED
    pos2.current += SPEED
    if (Math.abs(pos1.current) >= half1) pos1.current = 0
    if (pos2.current >= 0) pos2.current = -half2
    c1.style.transform = `translateY(${pos1.current}px)`
    c2.style.transform = `translateY(${pos2.current}px)`
    animRef.current = requestAnimationFrame(tick)
  }
  animRef.current = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(animRef.current)
}, [])

  return (
    <section id="skills" className="skills-section">
      <div className="section-wrap">
        <div className="skills-header">
          <h2 className="section-title">My Toolkit</h2>
          <p className="section-sub">
            Technologies I reach for daily — from systems to cloud-scale deployments.
          </p>
        </div>

        <div className="sk-arena">
          <InfiniteCol items={COL_LEFT}  colRef={col1Ref} />

          <div className="sk-divider" aria-hidden="true">
            <svg className="sk-divider-svg" viewBox="0 0 56 420" preserveAspectRatio="none">
              <line x1="28" y1="0" x2="28" y2="420" stroke="var(--a)" strokeWidth="1.5" strokeOpacity="0.22" />
              <line x1="2"  y1="36"  x2="54" y2="36"  stroke="var(--a)" strokeWidth="2.5" strokeOpacity="0.65"/>
              <line x1="8"  y1="60"  x2="48" y2="60"  stroke="var(--a)" strokeWidth="1.8" strokeOpacity="0.48"/>
              <line x1="14" y1="84"  x2="42" y2="84"  stroke="var(--a)" strokeWidth="1.3" strokeOpacity="0.36"/>
              <line x1="20" y1="108" x2="36" y2="108" stroke="var(--a)" strokeWidth="1"   strokeOpacity="0.26"/>
              <line x1="23" y1="132" x2="33" y2="132" stroke="var(--a)" strokeWidth="0.8" strokeOpacity="0.18"/>
              <polygon points="28,18 34,30 28,42 22,30" fill="var(--a)" opacity="0.55" />
              <polygon points="28,196 37,210 28,224 19,210" fill="var(--a)" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
              </polygon>
              <polygon points="28,202 33,210 28,218 23,210" fill="var(--bg-1)" />
              <line x1="23" y1="288" x2="33" y2="288" stroke="var(--a)" strokeWidth="0.8" strokeOpacity="0.18"/>
              <line x1="20" y1="312" x2="36" y2="312" stroke="var(--a)" strokeWidth="1"   strokeOpacity="0.26"/>
              <line x1="14" y1="336" x2="42" y2="336" stroke="var(--a)" strokeWidth="1.3" strokeOpacity="0.36"/>
              <line x1="8"  y1="360" x2="48" y2="360" stroke="var(--a)" strokeWidth="1.8" strokeOpacity="0.48"/>
              <line x1="2"  y1="384" x2="54" y2="384" stroke="var(--a)" strokeWidth="2.5" strokeOpacity="0.65"/>
              <polygon points="28,378 34,390 28,402 22,390" fill="var(--a)" opacity="0.5" />
              <circle cx="2"  cy="36"  r="3"   fill="var(--a)" opacity="0.48"/>
              <circle cx="54" cy="36"  r="3"   fill="var(--a)" opacity="0.48"/>
              <circle cx="28" cy="36"  r="2"   fill="var(--a)" opacity="0.75"/>
              <circle cx="2"  cy="384" r="3"   fill="var(--a)" opacity="0.42"/>
              <circle cx="54" cy="384" r="3"   fill="var(--a)" opacity="0.42"/>
              <circle cx="28" cy="384" r="2"   fill="var(--a)" opacity="0.65"/>
              <circle cx="28" cy="0"   r="3.5" fill="var(--a)" opacity="0.85">
                <animate attributeName="cy"      values="28;392;28"    dur="3.5s" repeatCount="indefinite" calcMode="linear"/>
                <animate attributeName="opacity" values="0.85;0.3;0.85" dur="3.5s" repeatCount="indefinite"/>
              </circle>
            </svg>
          </div>

          <InfiniteCol items={COL_RIGHT} colRef={col2Ref} />
        </div>
      </div>
    </section>
  )
}
