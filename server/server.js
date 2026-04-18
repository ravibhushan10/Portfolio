import 'dotenv/config'
import express     from 'express'
import cors        from 'cors'
import connectDB   from './config/db.js'
import seedAdmin   from './utils/seedAdmin.js'
import publicRoutes from './routes/public.js'
import adminRoutes  from './routes/admin.js'


const app  = express()
const PORT = process.env.PORT || 5000

/* ── CORS ── */
app.use(cors({
  origin     : process.env.CLIENT_URL || 'http://localhost:5173',
  methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

/* ── Body parsers ── */
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))

/* ── Trust proxy (needed on Render / Railway) ── */
app.set('trust proxy', 1)

/* ── Health check ── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

/* ── Routes ── */
app.use('/api',       publicRoutes)
app.use('/api/admin', adminRoutes)

/* ── 404 ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

/* ── Global error handler ── */
app.use((err, _req, res, _next) => {
  console.error('Server error:', err)
  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5 MB per image.' })
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

if (process.env.NODE_ENV === 'production') {
  const PING_URL = process.env.RENDER_EXTERNAL_URL || ''
  if (PING_URL) {
    setInterval(async () => {
      try {
        await fetch(`${PING_URL}/api/health`)
        console.log('🏓 Keep-alive ping sent')
      } catch {}
    }, 10 * 60 * 1000)  
  }
}

/* ── Boot ── */
connectDB().then(async () => {
  await seedAdmin()
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})

export default app
