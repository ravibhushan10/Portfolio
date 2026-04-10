import { useEffect, useRef, useState } from 'react'
import {
  FaReact, FaNodeJs, FaAws, FaGithub, FaGit, FaLinux,
  FaDatabase, FaCode, FaTerminal, FaServer, FaCss3Alt,
  FaHtml5, FaDocker,
} from 'react-icons/fa'

const GROUPS = [
  {
    label: 'Languages',
    skills: [
      { name: 'C',           icon: <FaCode />      },
      { name: 'C++',         icon: <FaCode />      },
      { name: 'JavaScript',  icon: <FaCode />      },
      { name: 'TypeScript',  icon: <FaCode />      },
      { name: 'SQL',         icon: <FaDatabase />  },
    ],
  },
  {
    label: 'Frontend',
    skills: [
      { name: 'React',        icon: <FaReact />    },
      { name: 'Redux',        icon: <FaCode />     },
      { name: 'Tailwind CSS', icon: <FaCss3Alt />  },
      { name: 'HTML5',        icon: <FaHtml5 />    },
      { name: 'CSS3',         icon: <FaCss3Alt />  },
    ],
  },
  {
    label: 'Backend',
    skills: [
      { name: 'Node.js',  icon: <FaNodeJs />   },
      { name: 'Express',  icon: <FaServer />   },
      { name: 'MongoDB',  icon: <FaDatabase /> },
      { name: 'MySQL',    icon: <FaDatabase /> },
      { name: 'Redis',    icon: <FaServer />   },
    ],
  },
  {
    label: 'Infrastructure',
    skills: [
      { name: 'AWS',     icon: <FaAws />      },
      { name: 'Git',     icon: <FaGit />      },
      { name: 'GitHub',  icon: <FaGithub />   },
      { name: 'Linux',   icon: <FaLinux />    },
      { name: 'VS Code', icon: <FaTerminal /> },
      { name: 'Postman', icon: <FaServer />   },
    ],
  },
]

export default function Skills() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" className="skills-section" ref={ref}>
      <div className="section-wrap">
       
        <h2 className="section-title">My Toolkit</h2>
        <p className="section-sub">
          Technologies I reach for daily — from low-level systems programming to cloud-scale deployments.
        </p>

        <div className="skills-grid">
          {GROUPS.map((group, gi) => (
            <div key={group.label}>
              <div className="skill-group-label">{group.label}</div>
              {group.skills.map((skill, si) => (
                <div
                  key={skill.name}
                  className={`skill-item${visible ? ' visible' : ''}`}
                  style={visible ? { transitionDelay: `${gi * 80 + si * 55}ms` } : {}}
                >
                  <span className="skill-item-icon">{skill.icon}</span>
                  {skill.name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
