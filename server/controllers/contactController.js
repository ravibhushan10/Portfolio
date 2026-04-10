import Contact from '../models/Contact.js'

export const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body

    /* Basic presence check (schema validation handles the rest) */
    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields.',
      })
    }

    const entry = await Contact.create({ fullName, email, phone, subject, message })

    return res.status(201).json({
      success: true,
      message: 'Message received! I will get back to you soon.',
      id: entry._id,
    })
  } catch (err) {
    /* Mongoose validation errors */
    if (err.name === 'ValidationError') {
      const first = Object.values(err.errors)[0].message
      return res.status(400).json({ success: false, message: first })
    }
    console.error('Contact submit error:', err)
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    })
  }
}

export const getContacts = async (_req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    return res.status(200).json({ success: true, count: contacts.length, data: contacts })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
