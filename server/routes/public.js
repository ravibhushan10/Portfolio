import express from 'express'
import { submitContact }              from '../controllers/contactController.js'
import { getProjects, incrementView } from '../controllers/projectController.js'
import { contactLimiter }             from '../middleware/rateLimit.js'

const router = express.Router()

// Contact form submission (rate-limited)
router.post('/contact',           contactLimiter, submitContact)

// Public project listing
router.get('/projects',           getProjects)

// Project view counter (fire-and-forget)
router.post('/projects/:id/view', incrementView)

export default router
