import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  GripVertical, X, Upload, ExternalLink, Github
} from 'lucide-react'

const EMPTY_FORM = {
  title: '', description: '', fullDescription: '',
  tags: '', features: '', github: '', live: '',
  order: 0, isVisible: true,
}

export default function AdminProjects({ authFetch }) {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)    // null | 'add' | 'edit'
  const [editing,  setEditing]  = useState(null)    // project being edited
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [coverFile, setCoverFile] = useState(null)
  const [imgFiles,  setImgFiles]  = useState([])
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await authFetch('/projects')
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }, [authFetch])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const openAdd = () => {
    setForm(EMPTY_FORM); setCoverFile(null); setImgFiles([])
    setEditing(null); setError(''); setModal('add')
  }

  const openEdit = p => {
    setForm({
      title          : p.title,
      description    : p.description,
      fullDescription: p.fullDescription || '',
      tags           : (p.tags || []).join(', '),
      features       : (p.features || []).join('\n'),
      github         : p.github || '',
      live           : p.live   || '',
      order          : p.order  ?? 0,
      isVisible      : p.isVisible !== false,
    })
    setCoverFile(null); setImgFiles([])
    setEditing(p); setError(''); setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditing(null); setError('') }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const buildFormData = () => {
    const fd = new FormData()
    fd.append('title',           form.title)
    fd.append('description',     form.description)
    fd.append('fullDescription', form.fullDescription)
    fd.append('tags',     JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)))
    fd.append('features', JSON.stringify(form.features.split('\n').map(f => f.trim()).filter(Boolean)))
    fd.append('github',    form.github)
    fd.append('live',      form.live)
    fd.append('order',     form.order)
    fd.append('isVisible', form.isVisible)
    if (coverFile)           fd.append('coverImage', coverFile)
    imgFiles.forEach(f => fd.append('images', f))
    return fd
  }

  const handleSave = async () => {
    if (!form.title || !form.description) {
      setError('Title and description are required'); return
    }
    setSaving(true); setError('')
    try {
      const fd  = buildFormData()
      const res = modal === 'add'
        ? await authFetch('/projects', { method: 'POST', body: fd })
        : await authFetch(`/projects/${editing._id}`, { method: 'PUT', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Save failed')
      closeModal(); fetchProjects()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this project? All images will be removed from Cloudinary.')) return
    try {
      await authFetch(`/projects/${id}`, { method: 'DELETE' })
      fetchProjects()
    } catch (err) { alert(err.message) }
  }

  const toggleVisibility = async p => {
    const fd = new FormData()
    fd.append('isVisible', !p.isVisible)
    await authFetch(`/projects/${p._id}`, { method: 'PUT', body: fd })
    fetchProjects()
  }

  return (
    <div className="admin-tab-content">

      {/* Header */}
      <div className="admin-projects-header">
        <div>
          <div className="admin-projects-count">{projects.length} Projects</div>
        </div>
        <button className="admin-add-btn" onClick={openAdd}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Projects table */}
      {loading ? (
        <div className="admin-loading">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="admin-empty">No projects yet. Add your first one!</div>
      ) : (
        <div className="admin-projects-list">
          {projects.map(p => (
            <div key={p._id} className="admin-project-row">
              <GripVertical size={14} className="admin-drag-handle" />

              <div className="admin-project-thumb">
                {p.img?.url
                  ? <img src={p.img.url} alt={p.title} />
                  : <div className="admin-project-thumb-empty" />
                }
              </div>

              <div className="admin-project-info">
                <div className="admin-project-title">{p.title}</div>
                <div className="admin-project-desc">{p.description}</div>
                <div className="admin-project-meta">
                  <span>{(p.tags || []).slice(0, 3).join(' · ')}</span>
                  <span className="admin-project-views">{p.views || 0} views</span>
                  <span className={`admin-visibility-badge ${p.isVisible ? 'visible' : 'hidden'}`}>
                    {p.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="admin-project-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="admin-icon-btn">
                    <Github size={13} />
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="admin-icon-btn">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              <div className="admin-project-actions">
                <button className="admin-icon-btn" onClick={() => toggleVisibility(p)}
                  title={p.isVisible ? 'Hide' : 'Show'}>
                  {p.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button className="admin-icon-btn" onClick={() => openEdit(p)} title="Edit">
                  <Pencil size={13} />
                </button>
                <button className="admin-icon-btn danger" onClick={() => handleDelete(p._id)} title="Delete">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modal && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>{modal === 'add' ? 'Add Project' : 'Edit Project'}</h2>
              <button className="admin-icon-btn" onClick={closeModal}><X size={15} /></button>
            </div>

            <div className="admin-modal-body">
              {error && <div className="admin-modal-error">{error}</div>}

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" name="title"
                    value={form.title} onChange={handleChange} placeholder="Project title" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Order</label>
                  <input className="admin-input" name="order" type="number"
                    value={form.order} onChange={handleChange} placeholder="0" />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Short Description * (shown on card)</label>
                <input className="admin-input" name="description"
                  value={form.description} onChange={handleChange}
                  placeholder="One-line summary" maxLength={300} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Full Description (shown in modal)</label>
                <textarea className="admin-textarea" name="fullDescription" rows={4}
                  value={form.fullDescription} onChange={handleChange}
                  placeholder="Detailed description…" />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Tags (comma-separated)</label>
                  <input className="admin-input" name="tags"
                    value={form.tags} onChange={handleChange}
                    placeholder="React, Node.js, MongoDB" />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">GitHub URL</label>
                  <input className="admin-input" name="github"
                    value={form.github} onChange={handleChange}
                    placeholder="https://github.com/…" />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Key Features (one per line)</label>
                  <textarea className="admin-textarea" name="features" rows={3}
                    value={form.features} onChange={handleChange}
                    placeholder={"JWT authentication\nReal-time chat\nCloudinary uploads"} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Live URL</label>
                  <input className="admin-input" name="live"
                    value={form.live} onChange={handleChange}
                    placeholder="https://yourproject.vercel.app" />
                </div>
              </div>

              {/* Cover image */}
              <div className="admin-form-group">
                <label className="admin-label">Cover Image {modal === 'edit' ? '(leave blank to keep existing)' : '*'}</label>
                <label className="admin-file-label">
                  <Upload size={13} />
                  {coverFile ? coverFile.name : 'Click to upload cover image'}
                  <input type="file" accept="image/*"
                    onChange={e => setCoverFile(e.target.files[0])} hidden />
                </label>
                {modal === 'edit' && editing?.img?.url && !coverFile && (
                  <img src={editing.img.url} alt="current cover"
                    style={{ marginTop: 8, height: 60, borderRadius: 6, objectFit: 'cover' }} />
                )}
              </div>

              {/* Carousel images */}
              <div className="admin-form-group">
                <label className="admin-label">Carousel Images (up to 10)</label>
                <label className="admin-file-label">
                  <Upload size={13} />
                  {imgFiles.length > 0 ? `${imgFiles.length} file(s) selected` : 'Click to upload screenshots'}
                  <input type="file" accept="image/*" multiple
                    onChange={e => setImgFiles(Array.from(e.target.files))} hidden />
                </label>
              </div>

              {/* Visibility toggle */}
              <div className="admin-form-group admin-checkbox-row">
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isVisible"
                    checked={form.isVisible} onChange={handleChange} />
                  Visible on portfolio
                </label>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving ? <span className="admin-spinner" /> : null}
                {saving ? 'Saving…' : modal === 'add' ? 'Add Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
