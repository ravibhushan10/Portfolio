import rateLimit from 'express-rate-limit'

export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 10,
  message : { success: false, message: 'Too many messages sent. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders  : false,
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 10,
  message : { success: false, message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders  : false,
})
