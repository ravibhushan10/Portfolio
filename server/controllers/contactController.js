import Contact from '../models/Contact.js'
import { sendContactNotification, sendAutoReply } from '../utils/email.js'

const rateLimitMap = new Map()
const RATE_LIMIT   = 10
const WINDOW_MS    = 15 * 60 * 1000

function checkRateLimit(ip) {
  const now    = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  if (record.count >= RATE_LIMIT) {
    const minutesLeft = Math.ceil((record.resetAt - now) / 60000)
    return { allowed: false, minutesLeft }
  }

  record.count++
  return { allowed: true }
}

export const submitContact = async (req, res) => {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown'
    const { allowed, minutesLeft } = checkRateLimit(ip)
    if (!allowed) {
      return res.status(429).json({
        success: false,
        message: `Too many messages sent. Please try again after ${minutesLeft} minute${minutesLeft > 1 ? 's' : ''}.`,
      })
    }

    const { fullName, email, phone, subject, message } = req.body

    if (!fullName?.trim())
      return res.status(400).json({ success: false, message: 'Full name is required.' })
    if (fullName.trim().length < 2)
      return res.status(400).json({ success: false, message: 'Name must be at least 2 characters.' })

    if (!email?.trim())
      return res.status(400).json({ success: false, message: 'Email is required.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })

    if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone))
      return res.status(400).json({ success: false, message: 'Please enter a valid phone number.' })

    if (!subject?.trim())
      return res.status(400).json({ success: false, message: 'Subject is required.' })

    if (!message?.trim())
      return res.status(400).json({ success: false, message: 'Message is required.' })
    if (message.trim().length < 10)
      return res.status(400).json({ success: false, message: 'Message must be at least 10 characters.' })
    if (message.trim().length > 2000)
      return res.status(400).json({ success: false, message: 'Message cannot exceed 2000 characters.' })

    const entry = await Contact.create({
      fullName: fullName.trim(),
      email   : email.trim().toLowerCase(),
      phone   : phone?.trim() || '',
      subject : subject.trim(),
      message : message.trim(),
    })

    Promise.allSettled([
      sendContactNotification({ fullName, email, phone, subject, message, id: entry._id }),
      sendAutoReply({ fullName, email }),
    ]).then(results => {
      results.forEach((r, i) => {
        if (r.status === 'rejected')
          console.error(`Email #${i} failed:`, r.reason?.message)
      })
    })

    return res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      id     : entry._id,
    })

  } catch (err) {
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0].message
      return res.status(400).json({ success: false, message: first })
    }
    console.error('Contact submit error:', err)
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' })
  }
}

export const getContacts = async (req, res) => {
  try {
    const { page = 1, limit = 20, read, starred, search } = req.query
    const filter = {}

    if (read    !== undefined) filter.isRead    = read    === 'true'
    if (starred !== undefined) filter.isStarred = starred === 'true'
    if (search) {
      const re = new RegExp(search, 'i')
      filter.$or = [{ fullName: re }, { email: re }, { subject: re }]
    }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Contact.countDocuments(filter)
    const data  = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    return res.json({ success: true, total, page: Number(page), data })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const updateContact = async (req, res) => {
  try {
    const allowed = ['isRead', 'isStarred', 'adminNote']
    const update  = {}
    allowed.forEach(k => { if (k in req.body) update[k] = req.body[k] })

    const doc = await Contact.findByIdAndUpdate(req.params.id, update, { new: true })
    if (!doc) return res.status(404).json({ success: false, message: 'Message not found' })
    return res.json({ success: true, data: doc })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const deleteContact = async (req, res) => {
  try {
    const doc = await Contact.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ success: false, message: 'Message not found' })
    return res.json({ success: true, message: 'Message deleted' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}

export const getContactStats = async (_req, res) => {
  try {
    const [total, unread, starred] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ isRead: false }),
      Contact.countDocuments({ isStarred: true }),
    ])
    return res.json({ success: true, data: { total, unread, starred } })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
