import 'dotenv/config'
import express      from 'express'
import cors         from 'cors'
import connectDB    from './config/db.js'
import seedAdmin    from './utils/seedAdmin.js'
import seedProjects from './utils/seedProjects.js'
import publicRoutes from './routes/public.js'
import adminRoutes  from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin     : process.env.CLIENT_URL,
  methods    : ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
}))

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true }))
app.set('trust proxy', 1)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api',       publicRoutes)
app.use('/api/admin', adminRoutes)


app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use((err, _req, res, _next) => {
  console.error('Server error:', err)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 5 MB per image.' })
  }
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

connectDB().then(async () => {
  await seedAdmin()
  await seedProjects()
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
})

export default app
