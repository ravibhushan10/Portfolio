import express        from 'express'
import cors           from 'cors'
import mongoose       from 'mongoose'
import dotenv         from 'dotenv'
import contactRoutes  from './routes/contact.js'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 5000

/* ── Middleware ── */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}))
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/* ── Routes ── */
app.use('/api', contactRoutes)

/* ── 404 handler ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

/* ── Connect DB then start ── */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })

export default app
