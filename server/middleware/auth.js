import jwt from 'jsonwebtoken'
/**
 * Protects admin-only routes.
 * Expects: Authorization: Bearer <token>
 */
const protect = (req, res, next) => {
  const header = req.headers.authorization || ''
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorised — token missing' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.admin = decoded  
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Not authorised — invalid token' })
  }
}

export default protect
