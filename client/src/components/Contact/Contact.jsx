import { useState } from 'react'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUser, FaTag, FaPaperPlane, FaHeart } from 'react-icons/fa'
import { FaGithub, FaLinkedin, FaInstagram} from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";
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
    href: 'https://www.google.com/maps/place/Langat+Singh+College/@25.6260068,84.1450358,6.72z/data=!4m6!3m5!1s0x39ed10e119cd7b81:0x4a58910aefe6de60!8m2!3d26.1165576!4d85.3785924!16s%2Fm%2F0tkj619?entry=ttu&g_ep=EgoyMDI2MDQwNy4wIKXMDSoASAFQAw%3D%3D',
    icon: <FaMapMarkerAlt />,
    title: 'Location',
    val: 'Muzaffarpur, Bihar, India',
    note: 'Available for remote worldwide',
    ext: true,
  },
]

const AVAIL = [
  { label: 'Full-time',    c: 'amber' },
  { label: 'Freelance',    c: 'green' },
  { label: 'Internship',   c: 'amber' },
  { label: 'Remote',       c: 'green' },
  { label: 'Open Source',  c: 'amber' },
]

const FOOTER_SOCIALS = [
  { href: 'https://github.com/ravibhushan10',                         icon: <FaGithub />,    label: 'GitHub'    },
  { href: 'https://www.linkedin.com/in/ravibhushan-kumar/',           icon: <FaLinkedin />,  label: 'LinkedIn'  },
  { href: 'https://x.com/Ravibhushan_12',                             icon: <FaXTwitter />,   label: 'X'         },
  { href: 'https://www.instagram.com/ravi_maurya.2/',                 icon: <FaInstagram />, label: 'Instagram' },
]

const EMPTY_FORM = { fullName: '', email: '', phone: '', subject: '', message: '' }

export default function Contact() {
  const [form,    setForm]    = useState(EMPTY_FORM)
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState(null)

  const showToast = (type, msg) => {
    setToast({ type, msg })
    setTimeout(() => setToast(null), 5000)
  }

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async e => {
    e.preventDefault()
    const { fullName, email, subject, message } = form
    if (!fullName || !email || !subject || !message)
      return showToast('error', 'Please fill in all required fields.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return showToast('error', 'Please enter a valid email address.')

    setLoading(true)
    try {
      const API = import.meta.env.VITE_API_URL
      const res = await fetch(`${API}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Submission failed')
      showToast('success', "Message sent! I'll get back to you soon 🎉")
      setForm(EMPTY_FORM)
    } catch (err) {
      const msg = err.message?.includes('fetch')
        ? 'Cannot connect to server. Try again later.'
        : err.message
      showToast('error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section id="contact" className="contact-section">
        <div className="section-wrap">

          {/* Big editorial heading */}
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

              <form onSubmit={onSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      Full Name <span className="form-required">*</span>
                    </label>
                    <div className="form-input-wrap">
                      <FaUser className="form-icon" />
                      <input className="form-input" type="text" name="fullName"
                        placeholder="Your full name" value={form.fullName}
                        onChange={onChange} disabled={loading} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Email <span className="form-required">*</span>
                    </label>
                    <div className="form-input-wrap">
                      <FaEnvelope className="form-icon" />
                      <input className="form-input" type="email" name="email"
                        placeholder="you@example.com" value={form.email}
                        onChange={onChange} disabled={loading} required />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <div className="form-input-wrap">
                      <FaPhone className="form-icon" />
                      <input className="form-input" type="tel" name="phone"
                        placeholder="Optional" value={form.phone}
                        onChange={onChange} disabled={loading} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Subject <span className="form-required">*</span>
                    </label>
                    <div className="form-input-wrap">
                      <FaTag className="form-icon" />
                      <input className="form-input" type="text" name="subject"
                        placeholder="What's this about?" value={form.subject}
                        onChange={onChange} disabled={loading} required />
                    </div>
                  </div>
                </div>

                <div className="form-group full" style={{ marginBottom: 0 }}>
                  <label className="form-label">
                    Message <span className="form-required">*</span>
                  </label>
                  <textarea className="form-textarea" name="message" rows={5}
                    placeholder="Tell me about your project or idea..."
                    value={form.message} onChange={onChange}
                    disabled={loading} required />
                </div>

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

      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'success' ? '✅' : '⚠️'} {toast.msg}
        </div>
      )}
    </>
  )
}
