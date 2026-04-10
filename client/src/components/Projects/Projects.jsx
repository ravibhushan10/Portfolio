import { useEffect, useState } from 'react'
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { projectsData } from '../../../data/Realdata/projectData'

const PER_PAGE = 3

export default function Projects() {
  const [projects,  setProjects]  = useState([])
  const [visible,   setVisible]   = useState(PER_PAGE)
  const [selected,  setSelected]  = useState(null)
  const [imgIdx,    setImgIdx]    = useState(0)

  useEffect(() => { setProjects(projectsData || []) }, [])

  // Lock scroll + keyboard close for modal
  useEffect(() => {
    if (!selected) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [selected])

  const open  = p => { setSelected(p); setImgIdx(0) }
  const close = ()  => setSelected(null)
  const prev  = ()  => setImgIdx(i => (i - 1 + selected.images.length) % selected.images.length)
  const next  = ()  => setImgIdx(i => (i + 1) % selected.images.length)

  return (
    <>
      <section id="projects" className="projects-section">
        <div className="section-wrap">
        
          <h2 className="section-title">Selected Work</h2>
          <p className="section-sub">
            Things I've built — from full-stack apps to developer tools and AI integrations.
          </p>

          <div className="projects-grid">
            {projects.slice(0, visible).map((p, i) => (
              <div key={p._id} className="project-card" onClick={() => open(p)}>
                <div className="project-img-wrap">
                  <img className="project-img" src={p.img} alt={p.title} loading="lazy" />
                  <div className="project-img-fade" />
                </div>

                <div className="project-body">
                  <div className="project-num">0{i + 1}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.description}</p>

                  <div className="project-tags">
                    {(p.tags || []).slice(0, 4).map(t => (
                      <span key={t} className="project-tag">{t}</span>
                    ))}
                    {(p.tags || []).length > 4 && (
                      <span className="project-tag">+{p.tags.length - 4}</span>
                    )}
                  </div>

                  <div className="project-footer">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noopener noreferrer"
                        className="project-link" onClick={e => e.stopPropagation()}>
                        <Github size={12} /> Code
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noopener noreferrer"
                        className="project-link" onClick={e => e.stopPropagation()}>
                        <ExternalLink size={12} /> Live
                      </a>
                    )}
                    <span className="project-link cta">Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visible < projects.length && (
            <div className="projects-load-more">
              <button className="btn btn-outline" onClick={() => setVisible(v => v + PER_PAGE)}>
                Load more projects
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Modal ── */}
      {selected && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={close} aria-label="Close">
              <X size={15} />
            </button>

            {/* Carousel */}
            {selected.images?.length > 0 && (
              <div className="modal-carousel">
                <img
                  className="modal-carousel-img"
                  src={selected.images[imgIdx]}
                  alt={`${selected.title} screenshot ${imgIdx + 1}`}
                />
                {selected.images.length > 1 && (
                  <>
                    <button className="modal-carousel-btn prev" onClick={prev} aria-label="Previous">
                      <ChevronLeft size={15} />
                    </button>
                    <button className="modal-carousel-btn next" onClick={next} aria-label="Next">
                      <ChevronRight size={15} />
                    </button>
                    <div className="modal-dots">
                      {selected.images.map((_, idx) => (
                        <span key={idx}
                          className={`modal-dot${idx === imgIdx ? ' active' : ''}`}
                          onClick={() => setImgIdx(idx)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="modal-content">
              <h2 className="modal-title">{selected.title}</h2>
              <p className="modal-desc">{selected.fullDescription || selected.description}</p>

              {selected.features?.length > 0 && (
                <>
                  <div className="modal-section-label">Key Features</div>
                  <div className="modal-features">
                    {selected.features.map(f => (
                      <div key={f} className="modal-feature">{f}</div>
                    ))}
                  </div>
                </>
              )}

              {selected.tags?.length > 0 && (
                <>
                  <div className="modal-section-label">Tech Stack</div>
                  <div className="project-tags" style={{ marginBottom: 0 }}>
                    {selected.tags.map(t => <span key={t} className="project-tag">{t}</span>)}
                  </div>
                </>
              )}

              <div className="modal-actions">
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                    <Github size={14} /> View Code
                  </a>
                )}
                {selected.live && (
                  <a href={selected.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    <ExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
