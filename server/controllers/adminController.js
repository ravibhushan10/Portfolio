import jwt   from 'jsonwebtoken'
import Admin from '../models/Admin.js'

/* ─────────────────────────────────────────────────────
   POST /api/admin/login
───────────────────────────────────────────────────── */
export const adminLogin = async (req, res) => {
  try {
    const { password } = req.body
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' })
    }

    const admin = await Admin.findOne({ username: 'admin' })
    if (!admin) {
      return res.status(500).json({ success: false, message: 'Admin not configured. Check ADMIN_PASSWORD env var.' })
    }

    const match = await admin.comparePassword(password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password' })
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      success: true,
      token,
      expiresIn: '7d',
    })
  } catch (err) {
    console.error('Admin login error:', err)
    return res.status(500).json({ success: false, message: 'Server error' })
  }
}

/* ─────────────────────────────────────────────────────
   GET /api/admin/me   (protected)
   Just verifies token is still valid
───────────────────────────────────────────────────── */
export const getMe = async (req, res) => {
  return res.json({ success: true, admin: req.admin })
}

/* ─────────────────────────────────────────────────────
   PATCH /api/admin/password  (protected)
   Change admin password
───────────────────────────────────────────────────── */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both currentPassword and newPassword are required' })
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' })
    }

    const admin = await Admin.findOne({ username: 'admin' })
    const match = await admin.comparePassword(currentPassword)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    const bcrypt = await import('bcryptjs')
    admin.passwordHash = await bcrypt.default.hash(newPassword, 12)
    await admin.save()

    return res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message })
  }
}
