import { useEffect, useState, useCallback } from 'react'
import { Github, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react'

const API = import.meta.env.VITE_API_URL
const PER_PAGE = 3


function cloudinaryUrl(url, { width } = {}) {
  if (!url || typeof url !== 'string') return ''
  if (!url) return ''
  if (!url.includes('res.cloudinary.com')) return url
  const transforms = ['f_auto', 'q_auto']
  if (width) transforms.push(`w_${width}`, 'c_limit')

  return url.replace('/upload/', `/upload/${transforms.join(',')}/`)
}


function LazyImage({ src, alt, className, width }) {
  const [visible, setVisible] = useState(false)
  const [loaded,  setLoaded]  = useState(false)
  const ref = useCallback(node => {
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { rootMargin: '200px' }
    )
    obs.observe(node)
  }, [])

  const optimisedSrc = visible ? cloudinaryUrl(src, { width }) : ''

  return (
    <div ref={ref} className={`lazy-img-wrap ${loaded ? 'loaded' : ''}`}>

      {visible && !loaded && <div className="lazy-img-shimmer" />}
      {optimisedSrc && (
        <img
          src={optimisedSrc}
          alt={alt}
          className={className}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity .3s ease' }}
        />
      )}
    </div>
  )
}

export default function Projects() {
  const [projects,  setProjects]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [visible,   setVisible]   = useState(PER_PAGE)
  const [selected,  setSelected]  = useState(null)
  const [imgIdx,    setImgIdx]    = useState(0)
  const [error,     setError]     = useState('')

useEffect(() => {
  const fetchProjects = async () => {

    const cached = sessionStorage.getItem('portfolio_projects')
    if (cached) {
      setProjects(JSON.parse(cached))
      setLoading(false)
      return
    }

    try {
      const res  = await fetch(`${API}/projects`)
      const data = await res.json()
      if (data.success) {
        setProjects(data.data)
        sessionStorage.setItem('portfolio_projects', JSON.stringify(data.data))
      } else {
        setError('Failed to load projects')
      }
    } catch {
      setError('Cannot connect to server')
    } finally {
      setLoading(false)
    }
  }
  fetchProjects()
}, [])


  useEffect(() => {
    if (!selected) { document.body.style.overflow = ''; return }
    document.body.style.overflow = 'hidden'
    const onKey = e => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [selected])

  const open = p => {
    setSelected(p)
    setImgIdx(0)

    fetch(`${API}/projects/${p._id}/view`, { method: 'POST' }).catch(() => {})
  }
  const close = () => setSelected(null)
  const prev  = () => setImgIdx(i => (i - 1 + selected.images.length) % selected.images.length)
  const next  = () => setImgIdx(i => (i + 1) % selected.images.length)


  const Skeleton = () => (
    <div className="project-card skeleton-card">
      <div className="skeleton skeleton-img" />
      <div className="project-body">
        <div className="skeleton skeleton-line short" />
        <div className="skeleton skeleton-line" />
        <div className="skeleton skeleton-line medium" />
      </div>
    </div>
  )

  return (
    <>
      <section id="projects" className="projects-section">
        <div className="section-wrap">

          <h2 className="section-title">Selected Work</h2>
          <p className="section-sub">
            Things I've built — from full-stack apps to developer tools and AI integrations.
          </p>

          {error && (
            <p style={{ textAlign: 'center', color: 'var(--a)', marginTop: '2rem' }}>{error}</p>
          )}

          <div className="projects-grid">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
              : projects.slice(0, visible).map((p, i) => (
                <div key={p._id} className="project-card" onClick={() => open(p)}>
                  <div className="project-img-wrap">
                    <LazyImage
                       src={p.img?.url || ''}
                      alt={p.title}
                      className="project-img"
                      width={800}
                    />
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
              ))
            }
          </div>

          {!loading && visible < projects.length && (
            <div className="projects-load-more">
              <button className="btn btn-outline" onClick={() => setVisible(v => v + PER_PAGE)}>
                Load more projects
              </button>
            </div>
          )}
        </div>
      </section>


      {selected && (
        <div className="modal-backdrop" onClick={close}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={close} aria-label="Close">
              <X size={15} />
            </button>


            {selected.images?.length > 0 && (
              <div className="modal-carousel">
                <LazyImage
                  src={selected.images[imgIdx]?.url || selected.images[imgIdx]}
                  alt={`${selected.title} screenshot ${imgIdx + 1}`}
                  className="modal-carousel-img"
                  width={1200}
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
