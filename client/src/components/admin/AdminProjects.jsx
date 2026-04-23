import {
  DndContext, closestCenter,
  PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, rectSortingStrategy,
  useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Pencil, Trash2, Eye, EyeOff,
  GripVertical, X, Upload, ExternalLink, Github,
  ImageIcon, AlertCircle, CheckCircle2, Images
} from 'lucide-react'

const EMPTY_FORM = {
  title: '', description: '', fullDescription: '',
  tags: '', features: '', github: '', live: '',
  order: 0, isVisible: true,
}

function SortableImage({ id, src, label, marked, onToggle, isNew }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform : CSS.Transform.toString(transform),
    transition,
    opacity   : isDragging ? 0.4 : 1,
    cursor    : 'grab',
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`admin-carousel-thumb ${marked ? 'marked-remove' : ''} ${isNew ? 'new-upload' : ''}`}
    >
      <img src={src} alt={label} />
      {onToggle && (
        <div className="admin-carousel-thumb-overlay">
          <button
            type="button"
            className={`admin-carousel-remove-btn ${marked ? 'undo' : ''}`}
            onClick={e => { e.stopPropagation(); onToggle() }}
          >
            {marked ? '↩' : <X size={10} />}
          </button>
        </div>
      )}
      {marked && <div className="admin-carousel-remove-label">Removing</div>}
      {isNew && <div className="admin-carousel-num">new</div>}
    </div>
  )
}

export default function AdminProjects({ authFetch }) {
  const [projects,       setProjects]       = useState([])
  const [loading,        setLoading]        = useState(true)
  const [modal,          setModal]          = useState(null)
  const [editing,        setEditing]        = useState(null)
  const [form,           setForm]           = useState(EMPTY_FORM)
  const [coverFile,      setCoverFile]      = useState(null)
  const [coverPreview,   setCoverPreview]   = useState(null)
  const [removeImageIds, setRemoveImageIds] = useState([])
  const [removeCover,    setRemoveCover]    = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [error,          setError]          = useState('')
  const [toast,          setToast]          = useState(null)
  const [unifiedImages,  setUnifiedImages]  = useState([])

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  }))

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setUnifiedImages(imgs => {
        const oldIndex = imgs.findIndex(i => i.id === active.id)
        const newIndex = imgs.findIndex(i => i.id === over.id)
        return arrayMove(imgs, oldIndex, newIndex)
      })
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

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
    setForm(EMPTY_FORM)
    setCoverFile(null); setCoverPreview(null)
    setRemoveImageIds([]); setRemoveCover(false)
    setUnifiedImages([])
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
    setCoverFile(null); setCoverPreview(null)
    setRemoveImageIds([]); setRemoveCover(false)
    setUnifiedImages(
      (p.images || []).map(img => ({
        id      : img.publicId,
        src     : img.url,
        publicId: img.publicId,
        isNew   : false,
      }))
    )
    setEditing(p); setError(''); setModal('edit')
  }

  const closeModal = () => {
    setModal(null); setEditing(null); setError('')
    setCoverFile(null); setCoverPreview(null)
    setRemoveImageIds([]); setRemoveCover(false)
    setUnifiedImages([])
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleCoverChange = e => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setRemoveCover(false)
    const reader = new FileReader()
    reader.onload = ev => setCoverPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleImgFilesChange = e => {
    const files = Array.from(e.target.files)
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader()
      r.onload = ev => res(ev.target.result)
      r.readAsDataURL(f)
    }))
    Promise.all(readers).then(previews => {
      const newEntries = previews.map((src, i) => ({
        id  : `new-${Date.now()}-${i}`,
        src,
        isNew: true,
        file : files[i],
      }))
      setUnifiedImages(prev => [...prev, ...newEntries])
    })
  }

  const toggleRemoveCarousel = publicId => {
    setRemoveImageIds(prev =>
      prev.includes(publicId)
        ? prev.filter(id => id !== publicId)
        : [...prev, publicId]
    )
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
    if (coverFile)                 fd.append('coverImage', coverFile)
    if (removeCover)               fd.append('removeCover', 'true')
    if (removeImageIds.length > 0) fd.append('removeImageIds', JSON.stringify(removeImageIds))

    const existingOrder = unifiedImages
      .filter(img => !img.isNew)
      .map(img => img.publicId)
    fd.append('imageOrder', JSON.stringify(existingOrder))

    unifiedImages
      .filter(img => img.isNew && img.file)
      .forEach(img => fd.append('images', img.file))

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
      closeModal()
      fetchProjects()
      showToast(modal === 'add' ? 'Project added!' : 'Project updated!')
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
      showToast('Project deleted')
    } catch (err) { showToast(err.message, 'error') }
  }

  const toggleVisibility = async p => {
    const fd = new FormData()
    fd.append('isVisible', !p.isVisible)
    await authFetch(`/projects/${p._id}`, { method: 'PUT', body: fd })
    fetchProjects()
  }

  const newCount      = unifiedImages.filter(i => i.isNew).length
  const totalAfterSave = unifiedImages.filter(i => !i.isNew && !removeImageIds.includes(i.publicId)).length + newCount

  return (
    <div className="admin-tab-content">

      {toast && (
        <div className={`admin-toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          {toast.msg}
        </div>
      )}

      <div className="admin-projects-header">
        <div className="admin-projects-count">
          <span className="admin-count-num">{projects.length}</span>
          <span className="admin-count-label">Projects</span>
        </div>
        <button className="admin-add-btn" onClick={openAdd}>
          <Plus size={14} /> Add Project
        </button>
      </div>

      {loading ? (
        <div className="admin-loading">
          <span className="admin-spinner-lg" />
          <span>Loading projects…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-empty">
          <ImageIcon size={32} strokeWidth={1} />
          <p>No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="admin-projects-list">
          {projects.map(p => (
            <div key={p._id} className="admin-project-row">
              <GripVertical size={14} className="admin-drag-handle" />

              <div className="admin-project-thumb">
                {p.img?.url
                  ? <img src={p.img.url} alt={p.title} />
                  : <div className="admin-project-thumb-empty"><ImageIcon size={16} strokeWidth={1} /></div>
                }
              </div>

              <div className="admin-project-info">
                <div className="admin-project-title">{p.title}</div>
                <div className="admin-project-desc">{p.description}</div>
                <div className="admin-project-meta">
                  <span className="admin-project-tags-inline">{(p.tags || []).slice(0, 3).join(' · ')}</span>
                  <span className="admin-meta-sep" />
                  <span className="admin-project-views">{p.views || 0} views</span>
                  {(p.images?.length > 0) && (
                    <>
                      <span className="admin-meta-sep" />
                      <span className="admin-project-imgs-count">
                        <Images size={11} /> {p.images.length}
                      </span>
                    </>
                  )}
                  <span className={`admin-visibility-badge ${p.isVisible ? 'visible' : 'hidden'}`}>
                    {p.isVisible ? 'Live' : 'Hidden'}
                  </span>
                </div>
              </div>

              <div className="admin-project-links">
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer" className="admin-icon-btn" title="GitHub">
                    <Github size={13} />
                  </a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="admin-icon-btn" title="Live site">
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>

              <div className="admin-project-actions">
                <button className="admin-icon-btn" onClick={() => toggleVisibility(p)}
                  title={p.isVisible ? 'Hide from portfolio' : 'Show on portfolio'}>
                  {p.isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
                <button className="admin-icon-btn" onClick={() => openEdit(p)} title="Edit project">
                  <Pencil size={13} />
                </button>
                <button className="admin-icon-btn danger" onClick={() => handleDelete(p._id)} title="Delete project">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="admin-modal-backdrop" onClick={closeModal}>
          <div className="admin-modal admin-modal-wide" onClick={e => e.stopPropagation()}>

            <div className="admin-modal-header">
              <div className="admin-modal-header-left">
                <div className="admin-modal-icon">
                  {modal === 'add' ? <Plus size={14} /> : <Pencil size={14} />}
                </div>
                <h2>{modal === 'add' ? 'Add Project' : 'Edit Project'}</h2>
              </div>
              <button className="admin-icon-btn" onClick={closeModal}><X size={15} /></button>
            </div>

            <div className="admin-modal-body">
              {error && (
                <div className="admin-modal-error">
                  <AlertCircle size={13} /> {error}
                </div>
              )}

              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Basic Info</div>
                <div className="admin-form-row">
                  <div className="admin-form-group" style={{ flex: 3 }}>
                    <label className="admin-label">Title *</label>
                    <input className="admin-input" name="title"
                      value={form.title} onChange={handleChange} placeholder="Project title" />
                  </div>
                  <div className="admin-form-group" style={{ flex: 1 }}>
                    <label className="admin-label">Order</label>
                    <input className="admin-input" name="order" type="number"
                      value={form.order} onChange={handleChange} placeholder="0" />
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Short Description * <span className="admin-label-hint">(shown on card)</span></label>
                  <input className="admin-input" name="description"
                    value={form.description} onChange={handleChange}
                    placeholder="One-line summary" maxLength={300} />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Full Description <span className="admin-label-hint">(shown in modal)</span></label>
                  <textarea className="admin-textarea" name="fullDescription" rows={3}
                    value={form.fullDescription} onChange={handleChange}
                    placeholder="Detailed description…" />
                </div>
              </div>

              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Links & Meta</div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-label">Tags <span className="admin-label-hint">(comma-separated)</span></label>
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
                    <label className="admin-label">Key Features <span className="admin-label-hint">(one per line)</span></label>
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
              </div>

              <div className="admin-modal-section">
                <div className="admin-modal-section-title">Cover Image</div>

                {modal === 'edit' && editing?.img?.url && !coverFile && !removeCover && (
                  <div className="admin-img-current-wrap">
                    <img src={editing.img.url} alt="current cover" className="admin-cover-preview" />
                    <div className="admin-img-current-overlay">
                      <span className="admin-img-current-label">Current cover</span>
                      <button type="button" className="admin-img-remove-btn"
                        onClick={() => setRemoveCover(true)} title="Remove cover image">
                        <X size={12} /> Remove
                      </button>
                    </div>
                  </div>
                )}

                {removeCover && (
                  <div className="admin-img-removed-notice">
                    <AlertCircle size={13} />
                    Cover will be removed on save.
                    <button type="button" className="admin-undo-btn" onClick={() => setRemoveCover(false)}>Undo</button>
                  </div>
                )}

                {coverPreview && (
                  <div className="admin-img-current-wrap">
                    <img src={coverPreview} alt="new cover preview" className="admin-cover-preview" />
                    <div className="admin-img-current-overlay">
                      <span className="admin-img-current-label admin-new-label">New cover</span>
                      <button type="button" className="admin-img-remove-btn"
                        onClick={() => { setCoverFile(null); setCoverPreview(null) }}>
                        <X size={12} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!coverPreview && (
                  <label className="admin-file-label">
                    <Upload size={13} />
                    {modal === 'edit' && editing?.img?.url
                      ? 'Upload new cover to replace'
                      : 'Click to upload cover image'}
                    <input type="file" accept="image/*" onChange={handleCoverChange} hidden />
                  </label>
                )}
              </div>


              <div className="admin-modal-section">
                <div className="admin-modal-section-title-row">
                  <div className="admin-modal-section-title">Carousel Images</div>
                  <span className="admin-carousel-count">
                    {totalAfterSave}/10 images
                    {removeImageIds.length > 0 && (
                      <span className="admin-removing-badge">{removeImageIds.length} removing</span>
                    )}
                  </span>
                </div>

                {unifiedImages.length > 0 && (
                  <>
                    <p style={{ fontSize: 11, color: 'var(--admin-muted, #888)', marginBottom: 8 }}>
                      Drag to reorder
                    </p>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={unifiedImages.map(i => i.id)} strategy={rectSortingStrategy}>
                        <div className="admin-carousel-grid">
                          {unifiedImages.map((img, idx) => {
                            const marked = !img.isNew && removeImageIds.includes(img.publicId)
                            return (
                              <SortableImage
                                key={img.id}
                                id={img.id}
                                src={img.src}
                                label={`image ${idx + 1}`}
                                marked={marked}
                                isNew={img.isNew}
                                onToggle={!img.isNew ? () => toggleRemoveCarousel(img.publicId) : null}
                              />
                            )
                          })}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </>
                )}

                <label className="admin-file-label" style={{ marginTop: unifiedImages.length > 0 ? 8 : 0 }}>
                  <Upload size={13} />
                  {newCount > 0
                    ? `${newCount} new image${newCount !== 1 ? 's' : ''} added — click to add more`
                    : unifiedImages.length > 0
                      ? 'Upload additional screenshots'
                      : 'Click to upload screenshots (up to 10)'}
                  <input type="file" accept="image/*" multiple onChange={handleImgFilesChange} hidden />
                </label>
              </div>

              
              <div className="admin-form-group admin-checkbox-row">
                <label className="admin-checkbox-label">
                  <input type="checkbox" name="isVisible"
                    checked={form.isVisible} onChange={handleChange} />
                  <span>Visible on portfolio</span>
                </label>
              </div>
            </div>

            <div className="admin-modal-footer">
              <button className="admin-cancel-btn" onClick={closeModal}>Cancel</button>
              <button className="admin-save-btn" onClick={handleSave} disabled={saving}>
                {saving && <span className="admin-spinner" />}
                {saving ? 'Saving…' : modal === 'add' ? 'Add Project' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
