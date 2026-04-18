import { useState, useEffect, useRef } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaTag, FaPaperPlane, FaHeart } from 'react-icons/fa'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

const INFO_CARDS = [
  {
    href: 'mailto:ravibhushankumar87tp@gmail.com',
    icon: <FaEnvelope />,
    title: 'Email',
    val: 'ravibhushankumar87tp@gmail.com',
    note: 'Replies within 24 hours',
  },
  {
    href: 'tel:+919199519751',
    icon: <FaPhone />,
    title: 'Phone',
    val: '+91 9199519751',
    note: 'Mon–Fri, 9 am–6 pm IST',
  },
  {
    href: 'https://www.google.com/maps/place/Langat+Singh+College/@26.1165757,85.3601384,15z/data=!3m1!4b1!4m6!3m5!1s0x39ed10e119cd7b81:0x4a58910aefe6de60!8m2!3d26.1165576!4d85.3785924!16s%2Fm%2F0tkj619?entry=ttu&g_ep=EgoyMDI2MDQxNS4wIKXMDSoASAFQAw%3D%3D',
    icon: <FaMapMarkerAlt />,
    title: 'Location',
    val: 'Muzaffarpur, Bihar, India',
    note: 'Available for remote worldwide',
    ext: true,
  },
]

const FOOTER_SOCIALS = [
  { href: 'https://github.com/ravibhushan10',               icon: <FaGithub />,   label: 'GitHub'   },
  { href: 'https://www.linkedin.com/in/ravibhushan-kumar/', icon: <FaLinkedin />, label: 'LinkedIn' },
  { href: 'https://x.com/Ravibhushan_12',                   icon: <FaXTwitter />, label: 'X'        },
  { href: 'https://www.instagram.com/ravi_maurya.2/',       icon: <FaInstagram />,label: 'Instagram'},
]

const EMPTY_FORM = { fullName: '', email: '', phone: '', subject: '', message: '' }

// ── Validation rules per field ──────────────────────────────────────────────
const VALIDATORS = {
  fullName: (v) => {
    if (!v.trim())               return 'Full name is required.'
    if (v.trim().length < 2)     return 'Name must be at least 2 characters.'
    if (v.trim().length > 80)    return 'Name cannot exceed 80 characters.'
    return null
  },
  email: (v) => {
    if (!v.trim())               return 'Email is required.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.'
    return null
  },
  phone: (v) => {
    if (v && !/^\+?[\d\s\-()]{7,15}$/.test(v)) return 'Please enter a valid phone number.'
    return null
  },
  subject: (v) => {
    if (!v.trim())               return 'Subject is required.'
    if (v.trim().length > 150)   return 'Subject cannot exceed 150 characters.'
    return null
  },
  message: (v) => {
    if (!v.trim())               return 'Message is required.'
    if (v.trim().length < 10)    return 'Message must be at least 10 characters.'
    if (v.trim().length > 2000)  return 'Message cannot exceed 2000 characters.'
    return null
  },
}

// Fields in order
const FIELD_ORDER = ['fullName', 'email', 'phone', 'subject', 'message']

export default function Contact() {
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [touched,     setTouched]     = useState({})
  const [fieldErrors, setFieldErrors] = useState({})
  const [genericError,setGenericError]= useState('')
  const [loading,     setLoading]     = useState(false)
  const [successMsg,  setSuccessMsg]  = useState('')

  // Refs for auto-dismiss timers
  const successTimerRef = useRef(null)
  const errorTimerRef = useRef(null)

  // ── Auto-dismiss success message after 3 seconds ──────────────────────────
  useEffect(() => {
    if (successMsg) {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
      successTimerRef.current = setTimeout(() => {
        setSuccessMsg('')
      }, 3000)
    }

    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current)
      }
    }
  }, [successMsg])

  // ── Auto-dismiss generic error after 3 seconds ────────────────────────────
  useEffect(() => {
    if (genericError) {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
      }
      errorTimerRef.current = setTimeout(() => {
        setGenericError('')
      }, 3000)
    }

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
      }
    }
  }, [genericError])

  // ── Get the FIRST field that has an error and has been touched ────────────
  const getFirstErrorField = (currentForm, currentTouched) => {
    for (const field of FIELD_ORDER) {
      const err = VALIDATORS[field](currentForm[field])
      if (err && currentTouched[field]) {
        return { [field]: err }
      }
    }
    return {}
  }

  // ── onChange - just update form, NO validation while typing ───────────────
  const onChange = (e) => {
    const { name, value } = e.target
    const updatedForm = { ...form, [name]: value }
    setForm(updatedForm)

    // Clear messages when user starts typing
    setGenericError('')
    setSuccessMsg('')

    // Clear timers
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current)
      successTimerRef.current = null
    }
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }

    // Mark as touched
    const updatedTouched = { ...touched, [name]: true }
    setTouched(updatedTouched)

    // DON'T validate while typing - clear errors for this field while typing
    setFieldErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[name]
      return newErrors
    })
  }

  // ── onBlur - validate ONLY the field that was just left ───────────────────
  const onBlur = (e) => {
    const { name } = e.target

    // Mark this field as touched
    const updatedTouched = { ...touched, [name]: true }
    setTouched(updatedTouched)

    // Check if THIS field has an error
    const thisFieldError = VALIDATORS[name](form[name])

    if (thisFieldError) {
      // Check if this is the first broken field in order
      let isFirstBroken = true
      for (const field of FIELD_ORDER) {
        if (field === name) break // Stop when we reach current field
        const prevErr = VALIDATORS[field](form[field])
        if (prevErr && updatedTouched[field]) {
          isFirstBroken = false
          break
        }
      }

      if (isFirstBroken) {
        // Show error for this field
        setFieldErrors({ [name]: thisFieldError })
      }
      // If not first broken, don't show any error (first broken field already showing)
    } else {
      // This field is valid, clear its error
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]

        // After clearing, check if there's another broken field that should show
        if (Object.keys(newErrors).length === 0) {
          // Find the next broken field that's been touched
          for (const field of FIELD_ORDER) {
            const err = VALIDATORS[field](form[field])
            if (err && updatedTouched[field]) {
              return { [field]: err }
            }
          }
        }

        return newErrors
      })
    }
  }

  // ── onSubmit ──────────────────────────────────────────────────────────────
  const onSubmit = async (e) => {
    e.preventDefault()
    setGenericError('')
    setSuccessMsg('')

    // Clear timers
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current)
      successTimerRef.current = null
    }
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }

    // Touch all fields
    const allTouched = FIELD_ORDER.reduce((acc, f) => ({ ...acc, [f]: true }), {})
    setTouched(allTouched)

    // Find first field error
    for (const field of FIELD_ORDER) {
      const err = VALIDATORS[field](form[field])
      if (err) {
        setFieldErrors({ [field]: err })
        return
      }
    }

    // All valid - submit
    setLoading(true)
    setFieldErrors({})
    try {
      const API = import.meta.env.VITE_API_URL
      const res  = await fetch(`${API}/contact`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setGenericError(data.message || 'Submission failed. Please try again.')
        return
      }

      setSuccessMsg("Message sent successfully! I'll get back to you soon")
      setForm(EMPTY_FORM)
      setTouched({})
    } catch (err) {
      setGenericError(
        err.message?.includes('fetch')
          ? 'Cannot connect to server. Please try again later.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="contact" className="contact-section">
        <div className="section-wrap">

          {/* Editorial heading */}
          <div className="contact-hero-text">
            <h2 className="contact-big-title">
              Let's build<br />
              <em>something.</em>
            </h2>
            <p className="contact-tagline">
              Have a project in mind? I'd love to hear about it.
            </p>
          </div>

          <div className="contact-grid">

            {/* ── Left: info ── */}
            <div>
              <div className="contact-info-list">
                {INFO_CARDS.map(({ href, icon, title, val, note, ext }) => (
                  <a key={title} href={href} className="contact-info-card"
                    {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <div className="contact-info-icon">{icon}</div>
                    <div>
                      <div className="contact-info-title">{title}</div>
                      <div className="contact-info-val">{val}</div>
                      <div className="contact-info-note">{note}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="contact-form-wrap">
              <div className="contact-form-title">Send a message</div>

              <form onSubmit={onSubmit} noValidate>

                {/* Row 1: Full Name + Email */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="form-required">*</span>
                    </label>
                    <div className={`form-input-wrap ${fieldErrors.fullName ? 'input-error' : ''}`}>
                      <FaUser className="form-icon" />
                      <input
                        className="form-input"
                        type="text"
                        name="fullName"
                        placeholder="Your full name"
                        value={form.fullName}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        autoComplete="name"
                      />
                    </div>
                    {fieldErrors.fullName && (
                      <span className="field-error">{fieldErrors.fullName}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="form-required">*</span>
                    </label>
                    <div className={`form-input-wrap ${fieldErrors.email ? 'input-error' : ''}`}>
                      <FaEnvelope className="form-icon" />
                      <input
                        className="form-input"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        autoComplete="email"
                      />
                    </div>
                    {fieldErrors.email && (
                      <span className="field-error">{fieldErrors.email}</span>
                    )}
                  </div>
                </div>

                {/* Row 2: Phone + Subject */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div className={`form-input-wrap ${fieldErrors.phone ? 'input-error' : ''}`}>
                      <FaPhone className="form-icon" />
                      <input
                        className="form-input"
                        type="tel"
                        name="phone"
                        placeholder="Optional"
                        value={form.phone}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                        autoComplete="tel"
                      />
                    </div>
                    {fieldErrors.phone && (
                      <span className="field-error">{fieldErrors.phone}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Subject <span className="form-required">*</span>
                    </label>
                    <div className={`form-input-wrap ${fieldErrors.subject ? 'input-error' : ''}`}>
                      <FaTag className="form-icon" />
                      <input
                        className="form-input"
                        type="text"
                        name="subject"
                        placeholder="What's this about?"
                        value={form.subject}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={loading}
                      />
                    </div>
                    {fieldErrors.subject && (
                      <span className="field-error">{fieldErrors.subject}</span>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div className="form-group full" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Message <span className="form-required">*</span>
                  </label>
                  <textarea
                    className={`form-textarea ${fieldErrors.message ? 'input-error' : ''}`}
                    name="message"
                    rows={5}
                    placeholder="Tell me about your project or idea..."
                    value={form.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    disabled={loading}
                  />
                  <div className="char-counter">
                    <span className={form.message.length > 2000 ? 'char-over' : ''}>
                      {form.message.length}
                    </span>/2000
                  </div>
                  {fieldErrors.message && (
                    <span className="field-error">{fieldErrors.message}</span>
                  )}
                </div>

                {/* Generic error */}
                {genericError && (
                  <div className="generic-error">
                    {genericError}
                  </div>
                )}

                {/* Success message */}
                {successMsg && (
                  <div className="generic-success">
                    {successMsg}
                  </div>
                )}

                <button type="submit" className="form-submit" disabled={loading}>
                  {loading
                    ? <><span className="form-spinner" /> Sending...</>
                    : <><FaPaperPlane size={13} /> Send Message</>
                  }
                </button>

              </form>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <div className="footer-strip">
          <p className="footer-copy">
            © {new Date().getFullYear()} <span>Ravi Bhushan</span>. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '.45rem' }}>
            {FOOTER_SOCIALS.map(({ href, icon, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                className="hero-social-icon" aria-label={label}
                style={{ width: 32, height: 32, fontSize: '.8rem' }}>
                {icon}
              </a>
            ))}
          </div>
          <p className="footer-built">
            Build By <FaHeart size={9} /> Ravi Bhushan
          </p>
        </div>
      </section>
    </>
  )
}
