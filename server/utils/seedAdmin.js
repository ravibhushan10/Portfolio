import bcrypt from 'bcryptjs'
import Admin  from '../models/Admin.js'

/**
 * Called once after DB connects.
 * Creates the admin document if it doesn't exist yet.
 * ADMIN_PASSWORD env var is the plain-text master password.
 */
const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ username: 'admin' })
    if (existing) return  

    const plain = process.env.ADMIN_PASSWORD
    if (!plain) {
      console.warn('⚠️  ADMIN_PASSWORD not set — admin login will be unavailable')
      return
    }

    const passwordHash = await bcrypt.hash(plain, 12)
    await Admin.create({ username: 'admin', passwordHash })
    console.log('✅ Admin user seeded')
  } catch (err) {
    console.error('❌ Admin seed error:', err.message)
  }
}

export default seedAdmin
